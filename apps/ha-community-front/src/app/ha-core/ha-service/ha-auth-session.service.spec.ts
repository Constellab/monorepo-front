import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FlCleanerService } from '@monorepo/front-core-lib/fl-core';
import { of, throwError } from 'rxjs';

import { HaAuthService } from './ha-auth.service';
import { HaAuthSessionService } from './ha-auth-session.service';
import { HaRefreshCoordinatorService } from './ha-refresh-coordinator.service';

describe('HaAuthSessionService', () => {
  /** what the api announces for the access token: 15 minutes */
  const EXPIRES_IN = 900000;
  /** 80% of it, when the renewal is due */
  const RENEW_AT = 720000;

  let service: HaAuthSessionService;
  let authServiceSpy: { refresh: ReturnType<typeof vi.fn> };
  /** pass through: the cross-tab behaviour has its own spec, here only the wiring matters */
  let coordinatorSpy: { coordinate: ReturnType<typeof vi.fn> };

  function build(platform: 'browser' | 'server' = 'browser'): HaAuthSessionService {
    TestBed.resetTestingModule();
    authServiceSpy = {
      refresh: vi.fn().mockReturnValue(of({ status: 'LOGGED_IN', expiresIn: EXPIRES_IN })),
    };
    coordinatorSpy = {
      coordinate: vi.fn((refresh: () => unknown) => refresh()),
    };

    TestBed.configureTestingModule({
      providers: [
        HaAuthSessionService,
        { provide: HaAuthService, useValue: authServiceSpy },
        { provide: HaRefreshCoordinatorService, useValue: coordinatorSpy },
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });

    return TestBed.inject(HaAuthSessionService);
  }

  beforeEach(() => {
    vi.useFakeTimers();
    service = build();
  });

  afterEach(() => {
    service.clean();
    vi.useRealTimers();
  });

  describe('the renewal timer', () => {
    it('should renew before the access token expires', () => {
      // the token must never be dead when a request leaves: the 401 path is the net, not the plan
      service.schedule(EXPIRES_IN);

      vi.advanceTimersByTime(RENEW_AT - 1);
      expect(authServiceSpy.refresh).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should go through the cross tab coordinator, never straight to the api', () => {
      // refreshing without it lets another tab present the rotated token, which the API reads as a
      // theft and answers by deleting the session
      service.schedule(EXPIRES_IN);

      vi.advanceTimersByTime(RENEW_AT);

      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(1);
    });

    it('should replace the pending renewal rather than add one', () => {
      service.schedule(EXPIRES_IN);
      service.schedule(EXPIRES_IN);

      vi.advanceTimersByTime(RENEW_AT);

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should re-arm itself when another tab already refreshed', () => {
      // a skipped refresh carries no expiresIn, and losing the timer there would leave the tab
      // relying on 401s for the rest of its life
      coordinatorSpy.coordinate.mockReturnValue(of(null));
      service.schedule(EXPIRES_IN);

      vi.advanceTimersByTime(RENEW_AT);
      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(RENEW_AT);
      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(2);
    });

    it('should never retry a refresh that failed', () => {
      // a retry fast enough to still carry the consumed refresh token is what makes the api delete
      // the session. The next application call settles it instead, through the interceptor.
      authServiceSpy.refresh.mockReturnValue(throwError(() => new Error('401')));
      service.schedule(EXPIRES_IN);

      vi.advanceTimersByTime(RENEW_AT);
      vi.advanceTimersByTime(10 * EXPIRES_IN);

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should keep a very short lifetime from spinning', () => {
      // /auth/refresh is rate limited to 60 requests per minute and per IP
      service.schedule(1);

      vi.advanceTimersByTime(4999);
      expect(authServiceSpy.refresh).not.toHaveBeenCalled();

      vi.advanceTimersByTime(1);
      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should keep an absurdly long lifetime from firing at once', () => {
      // setTimeout overflows past 2^31-1 ms and fires immediately, so a delay meant to be far away
      // becomes a burst against the rate limited refresh route
      service.schedule(Number.MAX_SAFE_INTEGER);

      vi.advanceTimersByTime(1000);

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
    });

    it('should keep the last known lifetime when none is given', () => {
      service.schedule(EXPIRES_IN);

      service.schedule(null);

      vi.advanceTimersByTime(RENEW_AT);
      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should do nothing without a lifetime to go by', () => {
      service.schedule(null);

      vi.advanceTimersByTime(10 * EXPIRES_IN);

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
    });

    it('should stop at logout', () => {
      service.schedule(EXPIRES_IN);

      service.clean();

      vi.advanceTimersByTime(10 * EXPIRES_IN);
      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
    });

    it('should be stopped by the logout of the app, not only by a direct call', () => {
      // HaAuthService.logout() goes through FlCleanerService: without the registration the timer
      // would outlive the session and keep refreshing a pair the api already dropped
      service.schedule(EXPIRES_IN);

      FlCleanerService.getInstance().cleanServices();

      vi.advanceTimersByTime(10 * EXPIRES_IN);
      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
    });

    it('should not renew during server side rendering', () => {
      // the renewed Set-Cookie could not be plumbed back to the browser, and every render shares
      // one IP against the rate limit
      service = build('server');

      service.schedule(EXPIRES_IN);

      vi.advanceTimersByTime(10 * EXPIRES_IN);
      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
    });
  });

  describe('resume', () => {
    /** @returns whether the caller was let through, which is the only thing resume() ever says */
    function resume(): boolean {
      let completed = false;
      service.resume().subscribe(() => (completed = true));
      return completed;
    }

    it('should renew the pair', () => {
      expect(resume()).toBe(true);
      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should let the caller through even when the refresh failed', () => {
      // it concludes nothing: another tab may have won the rotation, and the access token in the
      // shared jar may be perfectly valid. Reporting a failure here made /user be skipped, which
      // showed a logged in user as anonymous while their requests kept working.
      authServiceSpy.refresh.mockReturnValue(throwError(() => new Error('401')));
      const onError = vi.fn();

      let completed = false;
      service.resume().subscribe({ next: () => (completed = true), error: onError });

      expect(completed).toBe(true);
      expect(onError).not.toHaveBeenCalled();
    });

    it('should go through the cross tab coordinator', () => {
      // three tabs restored at browser start refresh milliseconds apart, which is exactly the
      // collision the api punishes by destroying the session
      resume();

      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(1);
    });

    it('should be worth doing on a fresh page', () => {
      expect(service.shouldResume()).toBe(true);
    });

    it('should happen only once per page', () => {
      // /auth/refresh is rate limited per IP, and every anonymous visitor of a public site would
      // otherwise keep asking a question already answered
      resume();

      expect(service.shouldResume()).toBe(false);
    });

    it('should not be reasked after a 401 either', () => {
      authServiceSpy.refresh.mockReturnValue(throwError(() => new Error('401')));

      resume();

      expect(service.shouldResume()).toBe(false);
    });

    it('should be pointless once the session is known from a login', () => {
      service.schedule(EXPIRES_IN);

      expect(service.shouldResume()).toBe(false);
    });

    it('should never happen during server side rendering', () => {
      service = build('server');

      expect(service.shouldResume()).toBe(false);
    });
  });
});
