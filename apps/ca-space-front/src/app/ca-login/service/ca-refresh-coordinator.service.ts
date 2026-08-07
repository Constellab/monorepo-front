import { Injectable } from '@angular/core';
import { defaultIfEmpty, firstValueFrom, from, Observable, of } from 'rxjs';

/**
 * Serializes POST /auth/refresh across every tab of the origin, and skips it entirely when another
 * tab just did it.
 *
 * Why this is not optional. Rotation is single use: a refresh token presented a second time is
 * treated as stolen and the whole session is dropped - the legitimate holder loses it too. Two
 * cases must be told apart:
 *
 * - strictly simultaneous: both tabs present the same token, one rotation goes through and the
 *   other is rejected. A 401, no damage.
 * - staggered by a round trip: tab B sends its refresh while the token is still current, but it
 *   lands after tab A's rotation committed. B now presents the consumed token, and the session is
 *   destroyed.
 *
 * The second case is the ordinary one, not an exotic race: three tabs restored at browser start
 * fire their first API call milliseconds apart, all get a 401, all refresh. And the damage is
 * invisible at the time - everyone keeps working off the access token until it expires, then all
 * tabs are logged out with no apparent cause.
 *
 * Per tab deduplication cannot see any of this, it only knows its own document.
 *
 * Note what is NOT the fix: retrying a failed /auth/refresh. A retry fast enough to still carry the
 * consumed token turns the harmless case into the destructive one. Exclusion, never retry.
 */
@Injectable({
  providedIn: 'root',
})
export class CaRefreshCoordinatorService {
  /** Web Locks name, scoped to the origin, so every tab of the app competes for the same one. */
  private static readonly LOCK_NAME: string = 'ca-auth-refresh';

  /** Timestamp of the last refresh that succeeded, shared between tabs. */
  private static readonly LAST_REFRESH_KEY: string = 'caLastAuthRefresh';

  /**
   * How long a successful refresh vouches for the token pair.
   *
   * All tabs share one cookie jar, so a refresh renews the access token for everyone: a 401 landing
   * just after one is stale by construction, and replaying it is enough. Kept short - it only has
   * to cover the flight time of a request that crossed a rotation, not the whole lifetime of the
   * access token, and a value too generous would skip a refresh that was genuinely needed.
   */
  private static readonly RECENT_REFRESH_MS: number = 10_000;

  /**
   * Run the refresh under the cross-tab lock, unless another tab already did it a moment ago.
   *
   * @param refresh the actual call, invoked at most once and only from inside the lock
   * @returns the refresh outcome, or null when it was skipped as unnecessary. A skip is a success:
   * the caller replays its request, which is all it wanted.
   */
  public coordinate<T>(refresh: () => Observable<T>): Observable<T | null> {
    return this.withLock(() => (this.refreshedRecently() ? of(null) : this.runAndRecord(refresh)));
  }

  private runAndRecord<T>(refresh: () => Observable<T>): Observable<T> {
    return new Observable<T>((subscriber) => {
      const subscription = refresh().subscribe({
        next: (value) => {
          // only a success vouches for the token pair. Recording a failure would make every other
          // tab skip a refresh they still need.
          this.recordRefresh();
          subscriber.next(value);
        },
        error: (error) => subscriber.error(error),
        complete: () => subscriber.complete(),
      });
      return () => subscription.unsubscribe();
    });
  }

  /**
   * Web Locks gives real mutual exclusion across tabs of the same origin, and releases the lock by
   * itself if the tab holding it dies. BroadcastChannel would only notify, which is not enough:
   * every tab would still have refreshed before hearing about it.
   *
   * Without Web Locks (Safari below 15.4) the recent refresh check carries this alone. That is the
   * acceptable half: it covers the staggered case, the destructive one. What is left uncovered is
   * two tabs checking before either recorded anything - the strictly simultaneous case, where the
   * API rejects one refresh without touching the session.
   */
  private withLock<T>(work: () => Observable<T | null>): Observable<T | null> {
    const lockManager: LockManager = this.getLockManager();
    if (!lockManager) {
      return work();
    }

    return from(
      lockManager.request(CaRefreshCoordinatorService.LOCK_NAME, () =>
        // the lock is held until this promise settles, so the next tab enters after the rotation
        // committed and sees the recorded timestamp
        firstValueFrom(work().pipe(defaultIfEmpty(null)))
      )
    );
  }

  private getLockManager(): LockManager {
    return typeof navigator !== 'undefined' && navigator.locks ? navigator.locks : null;
  }

  private refreshedRecently(): boolean {
    const at: number = Number(this.readStorage(CaRefreshCoordinatorService.LAST_REFRESH_KEY));
    if (!Number.isFinite(at) || at <= 0) {
      return false;
    }

    const elapsed: number = Date.now() - at;
    // a timestamp in the future means a clock change, not a recent refresh: refresh rather than
    // skip, the worst case is one unnecessary call
    return elapsed >= 0 && elapsed < CaRefreshCoordinatorService.RECENT_REFRESH_MS;
  }

  private recordRefresh(): void {
    this.writeStorage(CaRefreshCoordinatorService.LAST_REFRESH_KEY, `${Date.now()}`);
  }

  /**
   * localStorage throws rather than returning null when it is disabled or full. Losing the shared
   * timestamp only costs a redundant refresh, so it must never break the renewal itself.
   */
  private readStorage(key: string): string {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch {
      // nothing to do, see readStorage
    }
  }
}
