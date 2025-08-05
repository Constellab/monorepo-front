import { inject,Injectable } from '@angular/core';
import { ClCredentials, ClCredentials2Fa } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlAuthLogin2FaResponse, FlAuthLoginResponse, FlAuthService } from '@monorepo/front-core-lib/fl-auth';
import { FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Service to handle login and logout and store cookie to check if user is connected
 */
@Injectable({
  providedIn: 'root',
})
export class LiAuthService extends FlAuthService {
  private apiService = inject(FlApiService);

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
    return this.apiService.post('login', credentials);
  }

  afterLogin(expiresIn: number): void {
    this.storeAuthExpirationCookie(expiresIn);
  }

  checkTwoFA(credentials: ClCredentials2Fa): Observable<FlAuthLogin2FaResponse> {
    return this.apiService.post('login-2fa', credentials);
  }

  /**
   * Remove the JWT from the memory and localstorage, clear the user data
   */
  public logout(): Observable<void> {
    return this.apiService.post('logout', null).pipe(
      tap(() => this.clearAuthExpirationCookie()),
      tap(() => this.clearServices())
    );
  }

  /**
   * Clear the store data in the services
   * @private
   */
  private clearServices(): void {
    FlCleanerService.getInstance().cleanServices();
  }
}
