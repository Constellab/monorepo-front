import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClCredentials, ClCredentials2Fa, ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlAuthLogin2FaResponse, FlAuthLoginResponse, FlAuthService } from '@monorepo/front-core-lib/fl-auth';
import { FlCleanerService, FlCookieOptions } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { HaAuthSessionService } from './ha-auth-session.service';

/**
 * The session marker the API owns, set alongside the two httpOnly credential cookies with Path '/'.
 * Only its presence carries meaning, its value is the constant '1'.
 *
 * Read only: the front never writes it. It reaches the SSR server only when the API sets it on a
 * domain the front shares, which is why it is one signal among several and never the only one.
 */
export const HA_SESSION_MARKER_COOKIE: string = 'Session_Active';

/**
 * The httpOnly cookie carrying the access token. Unreadable from the browser, but the SSR server
 * receives it and forwards it to the API (see HaHttpInterceptorSsrService).
 *
 * Its presence is the strongest "a session may exist" signal there is: it deliberately outlives the
 * 15 min token it carries, for the whole 30 days of the refresh token, precisely so that its
 * absence tells an anonymous visitor apart from an expired session.
 */
export const HA_AUTHORIZATION_COOKIE: string = 'Authorization';

@Injectable({
  providedIn: 'root',
})
export class HaAuthService extends FlAuthService {
  private apiService = inject(FlApiService);
  private http = inject(HttpClient);
  private sessionService = inject(HaAuthSessionService);

  private readonly route: string = 'auth';

  /**
   * Lifetime of the 'Auth_Expiration' marker the front writes for itself.
   *
   * It is the only marker readable on the browser, and the only one the SSR server is certain to
   * receive: the front writes it on the front origin, whereas the API sets its cookies on its own
   * domain, which a render served from another one never sees. It therefore stays useful after the
   * API ships Session_Active.
   *
   * The rule everything reading a marker relies on: it may be wrong by saying "maybe logged in",
   * never by saying "logged out". That holds only while it outlives the refresh token, hence a
   * duration deliberately longer than the API REFRESH_TOKEN_DURATION_SECONDS (30 days). Using the
   * 15 min access token 'expiresIn' here would log out every user with a perfectly valid session.
   */
  private static readonly SESSION_MARKER_DURATION_MS: number = 60 * ClDateHelper.ONE_DAY;

  constructor() {
    const cookieService = inject(FlCookieService);

    super(cookieService);
  }

  public login(credentials: ClCredentials): Observable<FlAuthLoginResponse> {
    return this.apiService.post(this.route + '/login', credentials);
  }

  public checkTwoFA(credentials: ClCredentials2Fa): Observable<FlAuthLogin2FaResponse> {
    return this.apiService.post(this.route + '/login-2fa', credentials);
  }

  /**
   * Renew the access token from the refresh token cookie, so an expired access token does not end
   * the session. The API replaces both httpOnly cookies and answers like a login.
   *
   * Deliberately bypasses FlApiService: its error pipeline routes a 401 to HaApiErrorService,
   * whose 'error.wrong_token' branch reloads the page - the caller would never see the failure.
   *
   * A failure does NOT clear the session marker. It does not prove the session is over: another
   * tab may have consumed the single-use refresh token a moment earlier and hold a valid session.
   * The caller decides, once it has retried the original request.
   */
  public refresh(): Observable<FlAuthLoginResponse> {
    return this.http
      .post<FlAuthLoginResponse>(this.apiService.getBaseRouteUrl(`${this.route}/refresh`), null, {
        withCredentials: true,
      })
      .pipe(tap((response) => this.afterLogin(response?.expiresIn)));
  }

  public logout(): Observable<void> {
    return this.apiService.post(`${this.route}/logout`, null).pipe(
      tap(() => this.clearSessionMarker()),
      tap(() => this.clearServices())
    );
  }

  /**
   * Host-only - no 'Domain' - so the marker never reaches another app of the platform, and no
   * other app can shadow it here. Community is a single host, it has nothing to share it with.
   *
   * 'Lax' rather than the default 'Strict', because this marker is read from the request header by
   * the SSR server, not only from `document.cookie`: a visitor arriving from a search result or a
   * shared link makes a cross-site top-level navigation, which is precisely where 'Strict'
   * withholds a cookie. The render would then come out logged out for a user whose session is
   * perfectly valid.
   */
  protected override getSessionMarkerOptions(): FlCookieOptions {
    return { ...super.getSessionMarkerOptions(), sameSite: 'Lax' };
  }

  /**
   * The single point where the app learns when its access token dies, for a login, a 2FA
   * completion or a refresh alike. Both things that follow from it happen here.
   *
   * @param expiresIn lifetime of the access token, which arms the proactive renewal - and only
   * that. The marker tracks the session, not the token, so it deliberately ignores this value: see
   * SESSION_MARKER_DURATION_MS.
   */
  public afterLogin(expiresIn: number | undefined): void {
    this.storeAuthExpirationCookie(HaAuthService.SESSION_MARKER_DURATION_MS);
    this.sessionService.schedule(expiresIn ?? null);
  }

  /**
   * Whether a session may exist, as far as the browser can tell on its own.
   *
   * The only question a marker is ever allowed to answer. It never says who is connected - a cookie
   * cannot know that a session was revoked, nor that an expired access token can be renewed - it
   * only lets the app skip a call it is sure would be pointless, for the anonymous visitors of a
   * public, indexed site. Every caller must treat a true as "ask the API".
   */
  public mayHaveSession(): boolean {
    return this.hasAuthorizationCookie();
  }

  private clearServices(): void {
    FlCleanerService.getInstance().cleanServices();
  }
}
