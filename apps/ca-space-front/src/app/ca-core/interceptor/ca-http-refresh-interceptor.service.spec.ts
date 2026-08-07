import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { of, Subject, throwError } from 'rxjs';

import { CaAuthService } from '../../ca-login/service/ca-auth.service';
import { CaAuthSessionService } from '../../ca-login/service/ca-auth-session.service';
import { CaRefreshCoordinatorService } from '../../ca-login/service/ca-refresh-coordinator.service';
import { CaHttpRefreshInterceptorService } from './ca-http-refresh-interceptor.service';

describe('CaHttpRefreshInterceptorService', () => {
  const API_URL = 'http://api.test/';
  const USER_URL = `${API_URL}users/current`;
  const COMMUNITY_URL = 'http://community-api.test/brick';

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: { refresh: ReturnType<typeof vi.fn> };
  /** pass through: the cross-tab behaviour has its own spec, here only the wiring matters */
  let coordinatorSpy: { coordinate: ReturnType<typeof vi.fn> };
  let sessionServiceSpy: { reportSessionOver: ReturnType<typeof vi.fn> };

  function configure(): void {
    TestBed.resetTestingModule();
    authServiceSpy = {
      refresh: vi.fn().mockReturnValue(of({ status: 'LOGGED_IN', expiresIn: 900000 })),
    };
    coordinatorSpy = {
      coordinate: vi.fn((refresh: () => unknown) => refresh()),
    };
    sessionServiceSpy = { reportSessionOver: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: CaHttpRefreshInterceptorService, multi: true },
        { provide: FlApiServiceConfig, useValue: { getApiUrl: () => API_URL } },
        { provide: CaAuthService, useValue: authServiceSpy },
        { provide: CaAuthSessionService, useValue: sessionServiceSpy },
        { provide: CaRefreshCoordinatorService, useValue: coordinatorSpy },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => configure());

  afterEach(() => httpMock.verify());

  /** fire a request and report its outcome, the assertions mostly look at the http mock */
  function call(url: string = USER_URL): { error?: HttpErrorResponse; body?: unknown } {
    const outcome: { error?: HttpErrorResponse; body?: unknown } = {};
    http.get(url).subscribe({
      next: (body) => (outcome.body = body),
      error: (error: HttpErrorResponse) => (outcome.error = error),
    });
    return outcome;
  }

  function unauthorized(): [unknown, { status: number; statusText: string }] {
    return [null, { status: 401, statusText: 'Unauthorized' }];
  }

  describe('when the access token expired', () => {
    it('should refresh then replay the request, transparently', () => {
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
      httpMock.expectOne(USER_URL).flush({ id: 'user-1' });
      expect(outcome.body).toEqual({ id: 'user-1' });
      expect(outcome.error).toBeUndefined();
    });

    it('should refresh only once for concurrent failures', () => {
      // rotation is single use: a second concurrent refresh would present a consumed token and
      // log out a user holding a perfectly valid session.
      const pendingRefresh = new Subject<unknown>();
      authServiceSpy.refresh.mockReturnValue(pendingRefresh.asObservable());

      call(USER_URL);
      call(`${API_URL}spaces/current`);

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(`${API_URL}spaces/current`).flush(...unauthorized());

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);

      pendingRefresh.next({ status: 'LOGGED_IN' });
      pendingRefresh.complete();

      httpMock.expectOne(USER_URL).flush({});
      httpMock.expectOne(`${API_URL}spaces/current`).flush({});
    });

    it('should go through the cross tab coordinator, never straight to the api', () => {
      // refreshing without it lets another tab present the rotated token, which the API reads as a
      // theft and answers by dropping the session
      call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(1);
      httpMock.expectOne(USER_URL).flush({});
    });

    it('should not report the end of the session when the renewal worked', () => {
      // the API answers 401 for an object the user may not touch too. Refused again on a freshly
      // renewed pair is that, not a dead session, and it must leave the user where they are.
      call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(sessionServiceSpy.reportSessionOver).not.toHaveBeenCalled();
    });

    it('should refresh again for a later failure', () => {
      call();
      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush({});

      call();
      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush({});

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(2);
    });
  });

  describe('when the refresh fails', () => {
    beforeEach(() => {
      authServiceSpy.refresh.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 401 })));
    });

    it('should still replay the request once', () => {
      // the failure may only mean another tab won the rotation race and already renewed the
      // cookies, in which case this tab now holds a token it did not mint.
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush({ id: 'user-1' });

      expect(outcome.body).toEqual({ id: 'user-1' });
    });

    it('should give up when the replay fails too', () => {
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(outcome.error?.status).toBe(401);
      // never a second attempt, a server side problem must not become an infinite loop
      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });

    it('should report the end of the session, so the user is logged out cleanly', () => {
      // renewal impossible and the request refused again: there is no session left. Only this
      // service knows both halves, and CaApiErrorService needs the answer to redirect.
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(sessionServiceSpy.reportSessionOver).toHaveBeenCalledTimes(1);
      // against the very failure it saw, so nothing can read the answer for another response
      expect(sessionServiceSpy.reportSessionOver).toHaveBeenCalledWith(outcome.error);
    });

    it('should say nothing when the replay succeeds', () => {
      // another tab won the rotation and this one now holds a valid token: nothing is over
      call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush({ id: 'user-1' });

      expect(sessionServiceSpy.reportSessionOver).not.toHaveBeenCalled();
    });

    it('should say nothing when the replay fails for another reason', () => {
      call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush(null, { status: 500, statusText: 'Error' });

      expect(sessionServiceSpy.reportSessionOver).not.toHaveBeenCalled();
    });

    it('should treat a missing refresh route as an ordinary failure', () => {
      // deployed before the back, /auth/refresh answers 404. Every failed refresh takes the same
      // path - replay once, then surface the error - so the status is never special cased.
      authServiceSpy.refresh.mockReturnValue(throwError(() => new HttpErrorResponse({ status: 404 })));
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(outcome.error?.status).toBe(401);
      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
    });
  });

  describe('when it must stay out of the way', () => {
    it.each(['auth/login', 'auth/login-2fa', 'auth/refresh', 'auth/logout'])(
      'should not refresh a 401 from %s',
      (route) => {
        // a 401 there is the final answer, never an expired access token to recover from
        const outcome = call(`${API_URL}${route}`);

        httpMock.expectOne(`${API_URL}${route}`).flush(...unauthorized());

        expect(authServiceSpy.refresh).not.toHaveBeenCalled();
        expect(outcome.error?.status).toBe(401);
      }
    );

    // only a 401 means "the access token expired". A 429 in particular means "retry later" and
    // must never be read as the end of a session.
    it.each([403, 429, 500])('should leave a %s untouched', (status) => {
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(null, { status, statusText: 'Error' });

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(outcome.error?.status).toBe(status);
    });

    it('should ignore a 401 from the community api', () => {
      // it owns its own credentials: the space refresh token cannot renew them, and spending a
      // rotation on it would be pure loss
      const outcome = call(COMMUNITY_URL);

      httpMock.expectOne(COMMUNITY_URL).flush(...unauthorized());

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(outcome.error?.status).toBe(401);
    });

    it('should ignore a request outside the api', () => {
      const outcome = call('/assets/i18n/ca-global-en.json');

      httpMock.expectOne('/assets/i18n/ca-global-en.json').flush(...unauthorized());

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(outcome.error?.status).toBe(401);
    });
  });
});

/** the interceptor must not depend on FlApiService, which would create a DI cycle via HttpClient */
describe('CaHttpRefreshInterceptorService dependencies', () => {
  it('should resolve without FlApiService provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        CaHttpRefreshInterceptorService,
        { provide: FlApiServiceConfig, useValue: { getApiUrl: (): string => 'http://api.test/' } },
        { provide: CaAuthService, useValue: {} },
        { provide: CaAuthSessionService, useValue: {} },
      ],
    });

    expect(TestBed.inject(CaHttpRefreshInterceptorService)).toBeTruthy();
  });
});
