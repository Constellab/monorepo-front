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
import { HaRefreshCoordinatorService } from './ha-refresh-coordinator.service';

/**
 * Tells the API this request can survive a 401: its sender knows how to renew the access token and
 * replay it.
 *
 * It matters on the routes that answer both anonymous visitors and logged in users - the brick,
 * story, agent, app and partner lists. Without it an expired access token gets a silent anonymous
 * 200 there: the user still looks logged in but their private entries vanish from the list. With
 * it the API answers 401, which is the signal to refresh.
 */
export const HA_AUTH_REFRESHABLE_HEADER: string = 'X-Auth-Refreshable';

/**
 * Keeps a session alive across the 15 minutes lifetime of the access token.
 *
 * A 401 on an API call means the access token expired, not that the session is over: the refresh
 * token lives 30 days. This interceptor marks the requests it can recover, renews the access token
 * and replays them, so the expiry is invisible to the rest of the app.
 *
 *     request + X-Auth-Refreshable -> 401 -> POST /auth/refresh -> replay
 *
 * Only the browser does any of this. During SSR the renewed cookies could not be plumbed back to
 * the browser, so the server must keep the tolerant behaviour instead - it does not announce the
 * header either, and an expired token gets it anonymous content and a 200 rather than a 401 that
 * would break the render. The browser takes over after hydration.
 *
 * Resources the browser fetches by itself - images, download links, iframes - never carry the
 * header: they do not go through HttpClient, hence not through here.
 */
@Injectable()
export class HaHttpRefreshInterceptorService implements HttpInterceptor {
  private platformId = inject(PLATFORM_ID);
  private apiConfig = inject(FlApiServiceConfig);
  private injector = inject(Injector);
  private refreshCoordinator = inject(HaRefreshCoordinatorService);

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
   * The refresh currently in flight, shared by every caller of THIS tab.
   *
   * Rotation is single use: presenting a refresh token consumes it. A page firing several calls
   * hits this on its first expiry, so two parallel refreshes would make the second present a
   * consumed token and log out a user holding a valid session.
   *
   * Other tabs are outside its reach, and there the stake is worse than a lost refresh - the API
   * destroys the session outright. HaRefreshCoordinatorService covers that.
   */
  private refreshInFlight: Observable<unknown> | null = null;

  /**
   * Resolved lazily: HaAuthService depends on HttpClient, which depends on the interceptors.
   * Injecting it as a field would close that cycle.
   */
  private get authService(): HaAuthService {
    return this.injector.get(HaAuthService);
  }

  /**
   * The header goes on exactly the requests this interceptor can recover, so the promise made to
   * the API is the one that gets kept: browser side, API bound, and outside the /auth routes where
   * a 401 is a final answer.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.canRefresh(req)) {
      return next.handle(req);
    }

    const refreshableReq: HttpRequest<any> = req.clone({
      setHeaders: { [HA_AUTH_REFRESHABLE_HEADER]: '1' },
    });

    return next
      .handle(refreshableReq)
      .pipe(
        catchError((error: HttpErrorResponse) =>
          error.status === 401 ? this.refreshThenReplay(refreshableReq, next) : throwError(() => error)
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

  /**
   * The replay is handed straight to the downstream handler, so a 401 on it is not caught again
   * here: one replay, then the error surfaces. A server side problem never becomes a loop.
   *
   * Ending the session is deliberately not done here: HaApiErrorService already owns that
   * decision, and it needs the marker cookie still in place to tell an expired session apart from
   * an anonymous visitor calling an authenticated endpoint. Clearing it here would blur the two.
   */
  private refreshThenReplay(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshOnce().pipe(
      // a failed refresh is not proof the session is over: another tab may have won the rotation
      // race, in which case this tab now holds cookies it did not mint. Replaying settles it.
      catchError(() => of(null)),
      switchMap(() => next.handle(req))
    );
  }

  /**
   * Two layers, both needed. This one collapses the concurrent 401 of a single tab into one
   * attempt; the coordinator then serializes that attempt against the other tabs, and drops it
   * altogether if one of them just renewed the pair.
   */
  private refreshOnce(): Observable<unknown> {
    if (!this.refreshInFlight) {
      this.refreshInFlight = this.refreshCoordinator
        .coordinate(() => this.authService.refresh())
        .pipe(
          finalize(() => (this.refreshInFlight = null)),
          shareReplay({ bufferSize: 1, refCount: false })
        );
    }
    return this.refreshInFlight;
  }
}
