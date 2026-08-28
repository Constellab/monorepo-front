import { PLATFORM_ID, REQUEST, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FL_AUTH_EXPIRED_COOKIE } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { of, throwError } from 'rxjs';

import { HaUser } from '../ha-model/ha-entities/ha-user';
import { HA_AUTHORIZATION_COOKIE, HA_SESSION_MARKER_COOKIE, HaAuthService } from './ha-auth.service';
import { HaAuthSessionService } from './ha-auth-session.service';
import { HA_SESSION_STATE_KEY, HaAuthenticatedUserService } from './ha-authenticated-user.service';

describe('HaAuthenticatedUserService', () => {
  const USER = { id: 'user-1', lang: 'en' } as unknown as HaUser;

  let apiServiceSpy: { get: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> };
  let sessionServiceSpy: {
    shouldResume: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
  };
  let authServiceSpy: { mayHaveSession: ReturnType<typeof vi.fn> };

  function build(
    platform: 'browser' | 'server',
    cookies: Record<string, string> | null = null
  ): HaAuthenticatedUserService {
    TestBed.resetTestingModule();
    apiServiceSpy = {
      get: vi.fn().mockReturnValue(of(USER)),
      put: vi.fn().mockReturnValue(of(undefined)),
    };
    // the startup resume has its own spec: by default the session is already known here
    sessionServiceSpy = {
      shouldResume: vi.fn().mockReturnValue(false),
      resume: vi.fn().mockReturnValue(of(undefined)),
    };
    // no marker written by the front, the harshest case for the browser side gate
    authServiceSpy = { mayHaveSession: vi.fn().mockReturnValue(false) };

    TestBed.configureTestingModule({
      providers: [
        HaAuthenticatedUserService,
        { provide: FlApiService, useValue: apiServiceSpy },
        { provide: FlTranslateService, useValue: { changeAppLanguage: vi.fn() } },
        { provide: FlSnackBarService, useValue: { openSuccessMessage: vi.fn() } },
        { provide: HaAuthSessionService, useValue: sessionServiceSpy },
        { provide: HaAuthService, useValue: authServiceSpy },
        { provide: PLATFORM_ID, useValue: platform },
        { provide: REQUEST, useValue: cookies ? { cookies } : null },
      ],
    });

    return TestBed.inject(HaAuthenticatedUserService);
  }

  function transferState(): TransferState {
    return TestBed.inject(TransferState);
  }

  describe('init on the browser', () => {
    it('should ask the api when nothing settled the question', () => {
      // the api is the authority, and an expired access token is renewed by the refresh
      // interceptor: without a proof there is no session, the call is worth making.
      const service = build('browser');

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });

    it('should skip the call when nothing at all suggests a session', () => {
      // an anonymous visitor of a public, indexed site must not spend a call to be told so
      const service = build('browser');
      transferState().set(HA_SESSION_STATE_KEY, false);

      service.init();

      expect(apiServiceSpy.get).not.toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should not take the renderer word for it against its own marker', () => {
      // the renderer only sees the cookies the browser sends it, and the api sets its own on its
      // own domain: a negative may just mean it was never shown them. Believing it left a logged
      // in user looking anonymous while their requests kept working.
      const service = build('browser');
      transferState().set(HA_SESSION_STATE_KEY, false);
      authServiceSpy.mayHaveSession.mockReturnValue(true);

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
      expect(service.getCurrentUser()).toBe(USER);
    });

    it('should ask the api when the server saw a session', () => {
      const service = build('browser');
      transferState().set(HA_SESSION_STATE_KEY, true);

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });

    it('should consume the transferred answer, not reuse it', () => {
      // init() runs again after a login. Reusing a stale "no session" would leave the user
      // looking anonymous right after signing in.
      const service = build('browser');
      transferState().set(HA_SESSION_STATE_KEY, false);
      service.init();

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });

    it('should publish the user', () => {
      const service = build('browser');

      service.init();

      expect(service.getCurrentUser()).toBe(USER);
    });

    it('should publish anonymous when the api refuses', () => {
      const service = build('browser');
      apiServiceSpy.get.mockReturnValue(throwError(() => new Error('401')));

      service.init();

      expect(service.getCurrentUser()).toBeNull();
    });
  });

  describe('resuming the session at startup', () => {
    /** a page that has not settled what its session is yet, which is what a reload leaves behind */
    function buildOnFreshPage(): HaAuthenticatedUserService {
      const service = build('browser');
      sessionServiceSpy.shouldResume.mockReturnValue(true);
      return service;
    }

    it('should renew the pair before asking who the user is', () => {
      // a reload loses everything: neither the login state nor the token deadline survives it, the
      // cookies being httpOnly. The refresh hands over the deadline, and the /user call then
      // leaves with a fresh token instead of a 401 to recover from.
      const service = buildOnFreshPage();

      service.init();

      expect(sessionServiceSpy.resume).toHaveBeenCalledTimes(1);
      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
      expect(service.getCurrentUser()).toBe(USER);
    });

    it('should ask the api even when the renewal failed', () => {
      // a failed refresh proves nothing - another tab may have won the rotation - and the access
      // token in the shared jar may be perfectly valid. Concluding here showed a logged in user as
      // anonymous while every one of their requests kept working.
      const service = buildOnFreshPage();
      // resume() says nothing about the outcome. Anything read as an answer here is a regression.
      sessionServiceSpy.resume.mockReturnValue(of(null));

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
      expect(service.getCurrentUser()).toBe(USER);
    });

    it('should not resume when the server saw no session', () => {
      // /auth/refresh is rate limited per IP and the site is public: a visitor who certainly has no
      // session must not spend a call to be told so.
      const service = buildOnFreshPage();
      transferState().set(HA_SESSION_STATE_KEY, false);

      service.init();

      expect(sessionServiceSpy.resume).not.toHaveBeenCalled();
    });

    it('should leave the decision to resume to the session service', () => {
      // init() runs again after a login, where the session is already known and a refresh would
      // rotate a token minted seconds earlier
      const service = build('browser');

      service.init();

      expect(sessionServiceSpy.resume).not.toHaveBeenCalled();
      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });
  });

  describe('init during server side rendering', () => {
    it('should skip the call without a marker cookie', () => {
      // the server cannot refresh an expired access token, so the marker is its only signal
      const service = build('server');

      service.init();

      expect(apiServiceSpy.get).not.toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should ask the api with the marker cookie set by the api', () => {
      const service = build('server', { [HA_SESSION_MARKER_COOKIE]: '1' });

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });

    it('should accept the marker the front writes for itself', () => {
      // the only one certain to reach a renderer served from another domain than the api
      const service = build('server', { [FL_AUTH_EXPIRED_COOKIE]: '123' });

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });

    it('should accept the access token cookie alone', () => {
      // it outlives the token it carries, for the 30 days of the refresh token, precisely so that
      // its absence is what tells an anonymous visitor from an expired session
      const service = build('server', { [HA_AUTHORIZATION_COOKIE]: 'jwt' });

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
    });

    it('should hand the answer over to the browser', () => {
      const service = build('server', { [HA_SESSION_MARKER_COOKIE]: '1' });

      service.init();

      expect(transferState().get(HA_SESSION_STATE_KEY, null)).toBe(true);
    });

    it('should hand over a negative answer too', () => {
      const service = build('server');

      service.init();

      expect(transferState().get(HA_SESSION_STATE_KEY, null)).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('should stay silent until the answer is known', () => {
      const service = build('browser');
      const emitted: boolean[] = [];

      service.isAuthenticated().subscribe((value) => emitted.push(value));

      expect(emitted).toEqual([]);
    });

    it('should emit true once the user is loaded', () => {
      const service = build('browser');
      const emitted: boolean[] = [];
      service.isAuthenticated().subscribe((value) => emitted.push(value));

      service.init();

      expect(emitted).toEqual([true]);
    });

    it('should emit false for an anonymous visitor', () => {
      const service = build('browser');
      apiServiceSpy.get.mockReturnValue(throwError(() => new Error('401')));
      const emitted: boolean[] = [];
      service.isAuthenticated().subscribe((value) => emitted.push(value));

      service.init();

      expect(emitted).toEqual([false]);
    });

    it('should follow a logout', () => {
      const service = build('browser');
      service.init();
      const emitted: boolean[] = [];
      service.isAuthenticated().subscribe((value) => emitted.push(value));

      service.clean();

      expect(emitted).toEqual([true, false]);
    });
  });
});
