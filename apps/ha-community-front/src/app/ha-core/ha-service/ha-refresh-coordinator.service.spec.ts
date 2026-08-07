import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Observable, of, Subject, throwError } from 'rxjs';

import { HaRefreshCoordinatorService } from './ha-refresh-coordinator.service';

describe('HaRefreshCoordinatorService', () => {
  const LAST_REFRESH_KEY = 'haLastAuthRefresh';

  let service: HaRefreshCoordinatorService;
  /** typed callable: the bare vi.fn() type cannot be invoked from a lambda */
  let refresh: ReturnType<typeof vi.fn<() => Observable<unknown>>>;

  /**
   * Stands in for navigator.locks. Grants the lock immediately but keeps the whole queue, so a test
   * can assert what a second tab would have seen.
   */
  function fakeLockManager(): { request: ReturnType<typeof vi.fn> } {
    return {
      request: vi.fn((name: string, callback: () => Promise<unknown>) => callback()),
    };
  }

  function configure(platform: 'browser' | 'server' = 'browser', locks: unknown = fakeLockManager()): void {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [HaRefreshCoordinatorService, { provide: PLATFORM_ID, useValue: platform }],
    });

    Object.defineProperty(navigator, 'locks', { value: locks, writable: true, configurable: true });

    service = TestBed.inject(HaRefreshCoordinatorService);
    refresh = vi.fn().mockReturnValue(of({ status: 'LOGGED_IN' }));
  }

  /** subscribe and report what happened, without swallowing an error */
  function coordinate(): { value?: unknown; error?: unknown; done: boolean } {
    const outcome: { value?: unknown; error?: unknown; done: boolean } = { done: false };
    service
      .coordinate(() => refresh())
      .subscribe({
        next: (value) => (outcome.value = value),
        error: (error) => (outcome.error = error ?? 'errored'),
        complete: () => (outcome.done = true),
      });
    return outcome;
  }

  beforeEach(() => {
    localStorage.clear();
    configure();
  });

  afterEach(() => localStorage.clear());

  describe('when no other tab refreshed', () => {
    it('should refresh', async () => {
      const outcome = coordinate();
      await Promise.resolve();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(outcome.value).toEqual({ status: 'LOGGED_IN' });
    });

    it('should record the success so the other tabs can skip', async () => {
      coordinate();
      await Promise.resolve();

      expect(Number(localStorage.getItem(LAST_REFRESH_KEY))).toBeGreaterThan(0);
    });

    it('should not record a failure', async () => {
      // recording one would make every other tab skip a refresh they still need
      refresh.mockReturnValue(throwError(() => new Error('no session')));

      coordinate();
      await Promise.resolve();

      expect(localStorage.getItem(LAST_REFRESH_KEY)).toBeNull();
    });

    it('should surface the failure to the caller', async () => {
      refresh.mockReturnValue(throwError(() => new Error('no session')));

      const outcome = coordinate();
      await Promise.resolve();
      await Promise.resolve();

      expect(outcome.error).toBeDefined();
    });
  });

  describe('when another tab just refreshed', () => {
    beforeEach(() => localStorage.setItem(LAST_REFRESH_KEY, `${Date.now()}`));

    it('should not present the rotated token a second time', async () => {
      // the API treats a reused refresh token as stolen and DELETES the session, logging out every
      // tab including the one that rotated legitimately
      const outcome = coordinate();
      await Promise.resolve();

      expect(refresh).not.toHaveBeenCalled();
      expect(outcome.value).toBeNull();
    });

    it('should still complete, a skip is a success', async () => {
      const outcome = coordinate();
      await Promise.resolve();
      await Promise.resolve();

      expect(outcome.error).toBeUndefined();
      expect(outcome.done).toBe(true);
    });
  });

  describe('when the recorded refresh is old', () => {
    it('should refresh again', async () => {
      localStorage.setItem(LAST_REFRESH_KEY, `${Date.now() - 60_000}`);

      coordinate();
      await Promise.resolve();

      expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('should refresh when the timestamp lies in the future', async () => {
      // a clock change must not look like a recent refresh, the cost of being wrong is a logout
      localStorage.setItem(LAST_REFRESH_KEY, `${Date.now() + 60_000}`);

      coordinate();
      await Promise.resolve();

      expect(refresh).toHaveBeenCalledTimes(1);
    });

    it('should refresh when the timestamp is not a number', async () => {
      localStorage.setItem(LAST_REFRESH_KEY, 'not-a-date');

      coordinate();
      await Promise.resolve();

      expect(refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('the cross tab lock', () => {
    it('should hold it for the whole refresh', async () => {
      // released too early, the next tab enters before the rotation committed and presents the
      // token that is about to be consumed
      const pending = new Subject<unknown>();
      refresh.mockReturnValue(pending.asObservable());
      const locks = fakeLockManager();
      configure('browser', locks);
      refresh.mockReturnValue(pending.asObservable());

      let released = false;
      locks.request.mockImplementation((name: string, callback: () => Promise<unknown>) =>
        callback().then(() => (released = true))
      );

      coordinate();
      await Promise.resolve();
      expect(released).toBe(false);

      pending.next({ status: 'LOGGED_IN' });
      pending.complete();
      await Promise.resolve();
      await Promise.resolve();

      expect(released).toBe(true);
    });

    it('should ask for a lock named for the origin', async () => {
      const locks = fakeLockManager();
      configure('browser', locks);

      coordinate();
      await Promise.resolve();

      expect(locks.request).toHaveBeenCalledWith('ha-auth-refresh', expect.any(Function));
    });

    it('should still refresh without Web Locks', async () => {
      // Safari below 15.4: the recent refresh check carries this alone, and it covers the case that
      // destroys the session
      configure('browser', undefined);

      const outcome = coordinate();
      await Promise.resolve();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(outcome.value).toEqual({ status: 'LOGGED_IN' });
    });

    it('should skip without Web Locks when another tab just refreshed', async () => {
      configure('browser', undefined);
      localStorage.setItem(LAST_REFRESH_KEY, `${Date.now()}`);

      coordinate();

      expect(refresh).not.toHaveBeenCalled();
    });
  });

  describe('during server side rendering', () => {
    it('should not touch the browser apis', () => {
      configure('server', undefined);

      const outcome = coordinate();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(outcome.value).toEqual({ status: 'LOGGED_IN' });
    });
  });
});
