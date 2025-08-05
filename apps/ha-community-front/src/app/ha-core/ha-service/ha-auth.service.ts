import { inject, Injectable } from '@angular/core';
import { ClCredentials, ClCredentials2Fa } from '@monorepo/core-lib';
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

  private readonly route: string = 'auth';

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

  public logout(): Observable<void> {
    return this.apiService.post(`${this.route}/logout`, null).pipe(
      tap(() => this.clearAuthExpirationCookie(null, 'Lax')),
      tap(() => this.clearServices())
    );
  }

  public afterLogin(expiresIn: number): void {
    this.storeAuthExpirationCookie(expiresIn, null, 'Lax');
  }

  private clearServices(): void {
    FlCleanerService.getInstance().cleanServices();
  }
}
