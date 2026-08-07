import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable, Injector } from '@angular/core';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, switchMap } from 'rxjs/operators';

import { CaAuthService } from '../../ca-login/service/ca-auth.service';
import { CaAuthSessionService } from '../../ca-login/service/ca-auth-session.service';
import { CaRefreshCoordinatorService } from '../../ca-login/service/ca-refresh-coordinator.service';

/**
 * Keeps a session alive across the short lifetime of the access token.
 *
 * A 401 on an API call means the access token expired, not that the session is over: the refresh
 * token lives far longer. This interceptor renews the access token and replays the request, so the
 * expiry is invisible to the rest of the app.
 *
 *     request -> 401 -> POST /auth/refresh -> replay
 *
 * It is the safety net, not the plan: CaAuthSessionService renews on a timer well before the token
 * dies, and this only catches what a timer cannot cover - a backgrounded tab, a machine waking from
 * sleep, a cold start.
 *
 * Scoped to the space API. The app also talks to the community API, which owns its own credentials:
 * refreshing the space session there would be pointless, and reading its 401 as an expired space
 * session would log the user out of the app.
 */
@Injectable()
export class CaHttpRefreshInterceptorService implements HttpInterceptor {
  private apiConfig = inject(FlApiServiceConfig);
  private injector = inject(Injector);
  private refreshCoordinator = inject(CaRefreshCoordinatorService);
  private sessionService = inject(CaAuthSessionService);

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
   * drops the session outright. CaRefreshCoordinatorService covers that.
   */
  private refreshInFlight: Observable<unknown> = null;

  /**
   * Resolved lazily: CaAuthService depends on HttpClient, which depends on the interceptors.
   * Injecting it as a field would close that cycle.
   */
  private get authService(): CaAuthService {
    return this.injector.get(CaAuthService);
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
    const apiUrl: string = this.apiConfig.getApiUrl();
    if (!req.url.startsWith(apiUrl)) {
      return false;
    }

    const route: string = req.url.substring(apiUrl.length);
    return !CaHttpRefreshInterceptorService.EXCLUDED_ROUTES.some(
      (excluded) => route === excluded || route.startsWith(`${excluded}?`)
    );
  }

  /**
   * The replay is handed straight to the downstream handler, so a 401 on it is not caught to
   * refresh again: one replay, then the error surfaces. A server side problem never becomes a loop.
   *
   * This is also the only place that can tell the two meanings of a 401 apart, so it records which
   * one it was. The API answers 401 both for an expired access token and for an object the user may
   * not touch, and nothing in the response separates them reliably - only the renewal outcome does.
   * A request refused again after the pair was renewed is an authorization failure and must leave
   * the user where they are; a request refused after the renewal itself failed is the end of the
   * session. Acting on it stays with CaApiErrorService, which owns the redirect.
   */
  private refreshThenReplay(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.refreshOnce().pipe(
      map(() => true),
      // a failed refresh is not proof the session is over: another tab may have won the rotation
      // race, in which case this tab now holds cookies it did not mint. Replaying settles it.
      catchError(() => of(false)),
      switchMap((renewed: boolean) =>
        next.handle(req).pipe(
          catchError((error: HttpErrorResponse) => {
            if (!renewed && error.status === 401) {
              this.sessionService.reportSessionOver();
            }
            return throwError(() => error);
          })
        )
      )
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
