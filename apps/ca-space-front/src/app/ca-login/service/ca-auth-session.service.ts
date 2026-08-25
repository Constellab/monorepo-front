import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, inject, Injectable, Injector } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlCleanableService, FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { CaAuthService } from './ca-auth.service';
import { CaRefreshCoordinatorService } from './ca-refresh-coordinator.service';

/**
 * Keeps the access token alive ahead of its expiry, and re-establishes the session when the page
 * loads.
 *
 * The cookies carrying the tokens are httpOnly: the app can neither read them nor know when they
 * die. The only expiry information it ever gets is the 'expiresIn' of a login or a refresh
 * response, so renewing on a timer is the only way to hold a token that is still valid when a
 * request leaves. The 401 handling of CaHttpRefreshInterceptorService is the safety net behind it,
 * for the cases a timer cannot cover - a backgrounded tab, a machine waking from sleep.
 *
 * Both halves go through CaRefreshCoordinatorService, without exception: rotation is single use and
 * the API drops the whole session when a consumed refresh token comes back.
 */
@Injectable({
  providedIn: 'root',
})
export class CaAuthSessionService implements FlCleanableService {
  private injector = inject(Injector);
  private refreshCoordinator = inject(CaRefreshCoordinatorService);

  /**
   * Share of the access token lifetime after which it is renewed, so the renewal completes well
   * before the token dies. The remaining fifth (3 min for a 15 min token) absorbs a slow round trip
   * and a clock drift between the browser and the API.
   */
  private static readonly RENEW_AT_RATIO: number = 0.8;

  /**
   * Floor for the timer. A misconfigured or very short 'expiresIn' must not turn the renewal into a
   * spin against a rate limited route. Below that floor the token expires before the timer fires,
   * which the 401 path handles.
   */
  private static readonly MIN_DELAY_MS: number = 5 * ClDateHelper.ONE_SECOND;

  /**
   * Ceiling for the timer, the largest delay setTimeout accepts. Above it the value overflows and
   * the callback fires immediately instead of much later - so a lifetime absurdly long would hammer
   * the very route the floor above protects, in the opposite direction.
   */
  private static readonly MAX_DELAY_MS: number = 2147483647;

  private timer: ReturnType<typeof setTimeout> | null = null;

  /** Last known access token lifetime, kept to re-arm the timer when a refresh was skipped. */
  private lastExpiresIn: number | null = null;

  /** Whether this page already knows what its session is - resumed or logged in. */
  private sessionResolved: boolean = false;

  /**
   * The failures that proved the session is over, held by identity. See isSessionOver().
   *
   * A WeakSet rather than a flag on purpose: the answer belongs to one response, not to the
   * service. A flag would have to be cleared, and any request that set it without going through
   * CaApiErrorService - a raw HttpClient call, a 401 arriving while already on the login page -
   * would leave it standing, so an ordinary permission 401 minutes later would read a stale yes and
   * throw a perfectly connected user out. Keyed on the error, there is nothing to go stale, and the
   * entry is collected with the response itself.
   */
  private readonly sessionOverErrors: WeakSet<HttpErrorResponse> = new WeakSet<HttpErrorResponse>();

  constructor() {
    const destroyRef = inject(DestroyRef);

    FlCleanerService.getInstance().registerService(this);
    destroyRef.onDestroy(() => {
      FlCleanerService.getInstance().unregisterService(this);
      this.cancel();
    });
  }

  /**
   * Whether the startup resume is still worth making: once per page, and only for a visitor a
   * marker says may have a session. That marker is only ever allowed to spare a pointless call -
   * it never decides who is connected, which is what the API answers.
   */
  public shouldResume(): boolean {
    return !this.sessionResolved && this.getAuthService().hasAuthorizationCookie();
  }

  /**
   * Renew the pair after a page load, where the app knows neither whether it is logged in nor when
   * its access token dies. The answer carries the 'expiresIn' that arms the timer, so a session
   * left open for hours never has to fall back on a 401.
   *
   * Best effort, and deliberately silent about the outcome: it concludes nothing when it fails. A
   * failure is not proof the session is over - another tab may have won the rotation, and the
   * access token sitting in the cookie jar may still be perfectly valid. The caller carries on and
   * lets the API answer.
   */
  public resume(): Observable<void> {
    if (!this.shouldResume()) {
      return of(undefined);
    }
    this.sessionResolved = true;

    return this.refreshCoordinator
      .coordinate(() => this.getAuthService().refresh())
      .pipe(
        // a skipped refresh (another tab renewed the pair a moment ago) carries no expiresIn, so
        // this tab arms nothing and waits for the 401 path to give it one
        map((): void => undefined),
        catchError(() => of<void>(undefined))
      );
  }

  /**
   * Whether the session is over for good, as opposed to an access token that had merely expired.
   *
   * The API answers 401 for both "your token expired" and "you may not touch this object", and
   * telling them apart from the response alone means trusting an error code the back is free to
   * change. The renewal outcome answers it without guessing: a request refused again after the pair
   * was successfully renewed is an authorization failure, and only a request refused after the
   * renewal itself failed means there is no session left.
   *
   * Recorded by CaHttpRefreshInterceptorService, the only place that knows both halves, against the
   * very failure it saw - so the answer can only ever be read for that one response.
   */
  public isSessionOver(error: HttpErrorResponse): boolean {
    return this.sessionOverErrors.has(error);
  }

  /** Called by the interceptor when a renewal failed and the replayed request was refused too. */
  public reportSessionOver(error: HttpErrorResponse): void {
    this.sessionOverErrors.add(error);
  }

  /**
   * Arm the renewal from the lifetime the API just announced. Called for every 'expiresIn' the app
   * receives - login, 2FA and refresh alike - through CaAuthService.afterLogin().
   *
   * @param expiresIn access token lifetime in milliseconds. Null or zero keeps the last known one,
   * which is what a skipped refresh leaves behind.
   */
  public schedule(expiresIn: number | null): void {
    this.sessionResolved = true;
    if (expiresIn != null && expiresIn > 0) {
      this.lastExpiresIn = expiresIn;
    }

    this.cancel();
    if (!this.lastExpiresIn) {
      return;
    }

    const delay: number = Math.min(
      CaAuthSessionService.MAX_DELAY_MS,
      Math.max(CaAuthSessionService.MIN_DELAY_MS, this.lastExpiresIn * CaAuthSessionService.RENEW_AT_RATIO)
    );
    this.timer = setTimeout(() => this.renew(), delay);
  }

  /** Cancel the renewal, on logout. */
  public clean(): void {
    this.cancel();
    this.lastExpiresIn = null;
  }

  /**
   * A success re-arms the timer by itself: CaAuthService.afterLogin() receives the new expiresIn.
   * Only a skipped refresh has to be re-armed here, from the last known lifetime.
   *
   * A failure stops the renewal for good and concludes nothing. It is not proof the session is
   * over - another tab may have won the rotation - and retrying a refresh that failed is precisely
   * what makes the API destroy a valid session. The next application call settles it: its 401 goes
   * through the interceptor, which refreshes, replays, and arms this timer again.
   */
  private renew(): void {
    this.timer = null;

    this.refreshCoordinator
      .coordinate(() => this.getAuthService().refresh())
      .subscribe({
        next: (response) => {
          if (response == null) {
            this.schedule(null);
          }
        },
        error: () => undefined,
      });
  }

  private cancel(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Resolved lazily: CaAuthService arms this timer from afterLogin(), so holding it as a field
   * would close the cycle.
   */
  private getAuthService(): CaAuthService {
    return this.injector.get(CaAuthService);
  }
}
