import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ClCredentials, ClCredentials2Fa, ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlAuthLogin2FaResponse, FlAuthLoginResponse, FlAuthService } from '@monorepo/front-core-lib/fl-auth';
import { FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CaEnvironmentHelper } from '../../ca-core/utils/ca-environment.helper';
import { CaAuthSessionService } from './ca-auth-session.service';

/**
 * Service to handle login and logout and store cookie to check if user is connected
 */
@Injectable({
  providedIn: 'root',
})
export class CaAuthService extends FlAuthService {
  private apiService = inject(FlApiService);
  private http = inject(HttpClient);
  private sessionService = inject(CaAuthSessionService);

  private readonly route: string = 'auth';

  /**
   * Lifetime of the 'Auth_Expiration' marker the front writes for itself.
   *
   * The marker only ever answers "this visitor may have a session", to spare a call that would be
   * pointless. It tracks the session, not the access token, so it must outlive the refresh token:
   * writing it with the access token 'expiresIn' would make every guard reading it treat a user
   * with a perfectly valid session as logged out a few minutes after login.
   */
  private static readonly SESSION_MARKER_DURATION_MS: number = 60 * ClDateHelper.ONE_DAY;

  constructor() {
    const cookieService = inject(FlCookieService);

    super(cookieService);
  }

  /**
   * Log in to API
   * The JWT is returned in a HTTPOnly cookie and is not accessible from JS
   * @param credentials username and password
   */
  public login(credentials: ClCredentials): Observable<FlAuthLoginResponse> {
    return this.apiService.post(this.route + '/login', credentials);
  }

  public checkTwoFA(credentials: ClCredentials2Fa): Observable<FlAuthLogin2FaResponse> {
    return this.apiService.post(this.route + '/login-2fa', credentials);
  }

  /**
   * Renew the access token from the refresh token cookie, so an expired access token does not end
   * the session. The API replaces the credential cookies and answers like a login.
   *
   * Deliberately bypasses FlApiService: its error pipeline routes a 401 to CaApiErrorService, which
   * sends the user back to the login page - the caller would never get to recover from the failure.
   *
   * A failure does NOT clear the session marker. It does not prove the session is over: another tab
   * may have consumed the single-use refresh token a moment earlier and hold a valid session. The
   * caller decides, once it has retried the original request.
   *
   * Never call this directly: go through CaRefreshCoordinatorService, which serializes the rotation
   * across tabs.
   */
  public refresh(): Observable<FlAuthLoginResponse> {
    return this.http
      .post<FlAuthLoginResponse>(this.apiService.getBaseRouteUrl(`${this.route}/refresh`), null, {
        withCredentials: true,
      })
      .pipe(tap((response) => this.afterLogin(response?.expiresIn)));
  }

  /**
   * Call the API to disconnect the user and remove his
   * JWT from the cookies
   */
  public logout(): Observable<void> {
    return this.apiService.post(this.route + '/logout', null).pipe(
      tap(() => this.clearAuthExpirationCookie(CaEnvironmentHelper.getFrontDomain())),
      tap(() => this.clearServices())
    );
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
    this.storeAuthExpirationCookie(
      CaAuthService.SESSION_MARKER_DURATION_MS,
      CaEnvironmentHelper.getFrontDomain()
    );
    this.sessionService.schedule(expiresIn ?? null);
  }

  /**
   * Clear the store data in the services
   * @private
   */
  private clearServices(): void {
    FlCleanerService.getInstance().cleanServices();
  }
}
