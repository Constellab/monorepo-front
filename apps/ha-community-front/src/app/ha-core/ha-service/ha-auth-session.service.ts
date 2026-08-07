import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlCleanableService, FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HaAuthService } from './ha-auth.service';
import { HaRefreshCoordinatorService } from './ha-refresh-coordinator.service';

/**
 * Keeps the access token alive ahead of its expiry, and re-establishes the session when the page
 * loads.
 *
 * The cookies carrying the tokens are httpOnly: the app can neither read them nor know when they
 * die. The only expiry information it ever gets is the 'expiresIn' of a login or a refresh
 * response, so renewing on a timer is the only way to hold a token that is still valid when a
 * request leaves. The 401 handling of HaHttpRefreshInterceptorService is the safety net behind it,
 * for the cases a timer cannot cover - a backgrounded tab, a machine waking from sleep.
 *
 * Both halves go through HaRefreshCoordinatorService, without exception: rotation is single use and
 * the API deletes the whole session when a consumed refresh token comes back.
 */
@Injectable({
  providedIn: 'root',
})
export class HaAuthSessionService implements FlCleanableService {
  private platformId = inject(PLATFORM_ID);
  private injector = inject(Injector);
  private refreshCoordinator = inject(HaRefreshCoordinatorService);

  /**
   * Share of the access token lifetime after which it is renewed, so the renewal completes well
   * before the token dies. The remaining fifth (3 min for a 15 min token) absorbs a slow round trip
   * and a clock drift between the browser and the API.
   */
  private static readonly RENEW_AT_RATIO: number = 0.8;

  /**
   * Floor for the timer. A misconfigured or very short 'expiresIn' must not turn the renewal into a
   * spin against a route rate limited to 60 requests per minute and per IP. Below that floor the
   * token expires before the timer fires, which the 401 path handles.
   */
  private static readonly MIN_DELAY_MS: number = 500000000000 * ClDateHelper.ONE_SECOND;

  private timer: ReturnType<typeof setTimeout> = null;

  /** Last known access token lifetime, kept to re-arm the timer when a refresh was skipped. */
  private lastExpiresIn: number = null;

  /**
   * Whether this page already knows what its session is - resumed, logged in, or proven anonymous.
   *
   * /auth/refresh answers 401 for every anonymous visitor, and the community site is public: asking
   * more than once per page would spend the shared rate limit of a whole corporate NAT on visitors
   * who have no session at all.
   */
  private sessionResolved: boolean = false;

  constructor() {
    const destroyRef = inject(DestroyRef);

    FlCleanerService.getInstance().registerService(this);
    destroyRef.onDestroy(() => {
      FlCleanerService.getInstance().unregisterService(this);
      this.cancel();
    });
  }

  /**
   * Whether the startup resume is still worth making. False once the session is known, and always
   * false on the server: the renewed Set-Cookie could not be plumbed back to the browser.
   */
  public shouldResume(): boolean {
    return isPlatformBrowser(this.platformId) && !this.sessionResolved;
  }

  /**
   * Re-establish the session after a page load, where the app knows neither whether it is logged in
   * nor when its access token dies.
   *
   * @returns true when the session is alive, false when the visitor is anonymous. A failure is an
   * ordinary answer here, not an error: it is what an anonymous visitor gets, and it must not be
   * reported as one.
   */
  public resume(): Observable<boolean> {
    this.sessionResolved = true;

    return this.refreshCoordinator
      .coordinate(() => this.getAuthService().refresh())
      .pipe(
        // a skipped refresh (another tab renewed the pair a moment ago) is a live session too, but it
        // carries no expiresIn, so this tab arms nothing and waits for the 401 path to give it one
        map(() => true),
        catchError(() => of(false))
      );
  }

  /**
   * Arm the renewal from the lifetime the API just announced. Called for every 'expiresIn' the app
   * receives - login, 2FA and refresh alike - through HaAuthService.afterLogin().
   *
   * @param expiresIn access token lifetime in milliseconds. Null or zero keeps the last known one,
   * which is what a skipped refresh leaves behind.
   */
  public schedule(expiresIn: number): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.sessionResolved = true;
    if (expiresIn > 0) {
      this.lastExpiresIn = expiresIn;
    }

    this.cancel();
    if (!this.lastExpiresIn) {
      return;
    }

    const delay: number = Math.max(
      HaAuthSessionService.MIN_DELAY_MS,
      this.lastExpiresIn * HaAuthSessionService.RENEW_AT_RATIO
    );
    this.timer = setTimeout(() => this.renew(), delay);
  }

  /** Cancel the renewal, on logout. */
  public clean(): void {
    this.cancel();
    this.lastExpiresIn = null;
  }

  /**
   * A success re-arms the timer by itself: HaAuthService.afterLogin() receives the new expiresIn.
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
   * Resolved lazily: HaAuthService arms this timer from afterLogin(), so holding it as a field
   * would close the cycle.
   */
  private getAuthService(): HaAuthService {
    return this.injector.get(HaAuthService);
  }
}
