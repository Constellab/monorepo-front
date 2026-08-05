import { isPlatformServer } from '@angular/common';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, shareReplay, switchMap } from 'rxjs/operators';

import { HaAuthService } from './ha-auth.service';

/**
 * Keeps a session alive across the 15 minutes lifetime of the access token.
 *
 * A 401 on an API call means the access token expired, not that the session is over: the refresh
 * token lives 30 days. This interceptor renews the access token and replays the request, so the
 * expiry is invisible to the rest of the app.
 *
 *     request -> 401 -> POST /auth/refresh -> replay
 *
 * Only the browser refreshes. During SSR the renewed cookies could not be plumbed back to the
 * browser, and every render shares one IP against the rate limit; the browser takes over after
 * hydration.
 */
@Injectable()
export class HaHttpRefreshInterceptorService implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);
  private apiConfig = inject(FlApiServiceConfig);
  private injector = inject(Injector);

  /**
   * Routes that must never trigger a refresh. Refreshing on /auth/refresh would loop, and the
   * login routes answer 401 on wrong credentials, which is not an expired session.
   */
  private static readonly EXCLUDED_ROUTES: string[] = [
    'auth/login',
    'auth/login-2fa',
    'auth/refresh',
    'auth/logout',
  ];

  /**
   * The refresh currently in flight, shared by every caller.
   *
   * Rotation is single use: presenting a refresh token consumes it. A page firing several calls
   * hits this on its first expiry, so two parallel refreshes would make the second present a
   * consumed token and log out a user holding a valid session.
   */
  private refreshInFlight: Observable<unknown> = null;

  /**
   * Resolved lazily: HaAuthService depends on HttpClient, which depends on the interceptors.
   * Injecting it as a field would close that cycle.
   */
  private get authService(): HaAuthService {
    return this.injector.get(HaAuthService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.canRefresh(req)) {
      return next.handle(req);
    }

    return next
      .handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          error.status === 401 ? this.refreshThenReplay(req, next) : throwError(() => error)
        )
      );
  }

  private canRefresh(req: HttpRequest<any>): boolean {
    if (isPlatformServer(this.platformId)) {
      return false;
    }

    const apiUrl: string = this.apiConfig.getApiUrl();
    if (!req.url.startsWith(apiUrl)) {
      return false;
    }

    const route: string = req.url.substring(apiUrl.length);
    return !HaHttpRefreshInterceptorService.EXCLUDED_ROUTES.some(
      (excluded) => route === excluded || route.startsWith(`${excluded}?`)
    );
  }

  private refreshThenReplay(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshOnce().pipe(
      // a failed refresh is not proof the session is over: another tab may have won the rotation
      // race, in which case this tab now holds cookies it did not mint. Replaying settles it.
      catchError(() => of(null)),
      switchMap(() => this.replay(req, next))
    );
  }

  /**
   * Replay the request a single time, then give up. Retrying in a loop would turn a server side
   * problem into an infinite one.
   *
   * Ending the session is deliberately not done here: HaApiErrorService already owns that
   * decision, and it needs the marker cookie still in place to tell an expired session apart from
   * an anonymous visitor calling an authenticated endpoint. Clearing it here would blur the two.
   */
  private replay(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }

  private refreshOnce(): Observable<unknown> {
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.authService.refresh().pipe(
        finalize(() => (this.refreshInFlight = null)),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this.refreshInFlight;
  }
}
