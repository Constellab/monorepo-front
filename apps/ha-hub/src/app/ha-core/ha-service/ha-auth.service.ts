import { Injectable } from '@angular/core';
import {
  FlApiService,
  FlAuthLogin2FaResponse,
  FlAuthLoginResponse,
  FlAuthService,
  FlCleanerService,
  FlCookieService,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ClCredentials, ClCredentials2Fa } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class HaAuthService extends FlAuthService {
  private readonly route: string = 'auth';

  constructor(
    private apiService: FlApiService,
    cookieService: FlCookieService
  ) {
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
      tap(() => this.clearAuthExpirationCookie()),
      tap(() => this.clearServices())
    );
  }

  public afterLogin(expiresIn: number): void {
    this.storeAuthExpirationCookie(expiresIn);
  }

  private clearServices(): void {
    FlCleanerService.getInstance().cleanServices();
  }
}
