import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClCredentials, ClCredentials2Fa, ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlAuthLogin2FaResponse, FlAuthLoginResponse, FlAuthService } from '@monorepo/front-core-lib/fl-auth';
import { FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HaAuthService extends FlAuthService {
  private apiService = inject(FlApiService);
  private http = inject(HttpClient);

  private readonly route: string = 'auth';

  /**
   * Lifetime of the 'Auth_Expiration' marker cookie, which is written by the front and not by
   * the API.
   *
   * The marker is only a hint telling the app a session may exist: it spares an API call for a
   * visitor who certainly has none (the community site is public and indexed) and lets the server
   * render the right shell during SSR, where cookies are the only thing readable synchronously.
   *
   * It may therefore be wrong by saying "maybe logged in", never by saying "logged out". That
   * holds only while it outlives the refresh token, hence a duration deliberately longer than the
   * API REFRESH_TOKEN_DURATION_SECONDS (30 days). Using the 15 min access token 'expiresIn' here
   * would log out every user with a perfectly valid session.
   *
   * Temporary: the API will own this cookie and set it alongside the two httpOnly ones, which
   * removes this duplicated constant.
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
   * Concluding here would make the marker lie in the one direction it must never lie. The caller
   * decides, once it has retried the original request.
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
      tap(() => this.clearAuthExpirationCookie(null, 'Lax')),
      tap(() => this.clearServices())
    );
  }

  /**
   * @param expiresIn lifetime of the access token, deliberately unused: the marker tracks the
   * session, not the access token. See SESSION_MARKER_DURATION_MS.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public afterLogin(expiresIn: number): void {
    this.storeAuthExpirationCookie(HaAuthService.SESSION_MARKER_DURATION_MS, null, 'Lax');
  }

  private clearServices(): void {
    FlCleanerService.getInstance().cleanServices();
  }
}
