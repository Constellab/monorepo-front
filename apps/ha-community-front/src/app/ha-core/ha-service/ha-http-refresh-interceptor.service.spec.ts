import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { of, Subject, throwError } from 'rxjs';

import { HaAuthService } from './ha-auth.service';
import { HaHttpRefreshInterceptorService } from './ha-http-refresh-interceptor.service';
import { HaRefreshCoordinatorService } from './ha-refresh-coordinator.service';

describe('HaHttpRefreshInterceptorService', () => {
  const API_URL = 'http://api.test/';
  const USER_URL = `${API_URL}user`;

  let http: HttpClient;
  let httpMock: HttpTestingController;
  let authServiceSpy: {
    refresh: ReturnType<typeof vi.fn>;
  };
  /** pass through: the cross-tab behaviour has its own spec, here only the wiring matters */
  let coordinatorSpy: { coordinate: ReturnType<typeof vi.fn> };

  function configure(platform: 'browser' | 'server' = 'browser'): void {
    TestBed.resetTestingModule();
    authServiceSpy = {
      refresh: vi.fn().mockReturnValue(of({ status: 'LOGGED_IN', expiresIn: 900000 })),
    };
    coordinatorSpy = {
      coordinate: vi.fn((refresh: () => unknown) => refresh()),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        { provide: HTTP_INTERCEPTORS, useClass: HaHttpRefreshInterceptorService, multi: true },
        { provide: FlApiServiceConfig, useValue: { getApiUrl: () => API_URL } },
        { provide: HaAuthService, useValue: authServiceSpy },
        { provide: HaRefreshCoordinatorService, useValue: coordinatorSpy },
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  }

  beforeEach(() => configure());

  afterEach(() => httpMock.verify());

  /** fire a request and swallow its outcome, the assertions look at the http mock */
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
    it('should refresh then replay the request', () => {
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
      call(`${API_URL}brick`);

      httpMock.expectOne(USER_URL).flush(...unauthorized());
      httpMock.expectOne(`${API_URL}brick`).flush(...unauthorized());

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);

      pendingRefresh.next({ status: 'LOGGED_IN' });
      pendingRefresh.complete();

      httpMock.expectOne(USER_URL).flush({});
      httpMock.expectOne(`${API_URL}brick`).flush({});
    });

    it('should go through the cross tab coordinator, never straight to the api', () => {
      // refreshing without it lets another tab present the rotated token, which the API reads as a
      // theft and answers by deleting the session
      call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(1);
      httpMock.expectOne(USER_URL).flush({});
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

    it('should treat a missing refresh route as an ordinary failure', () => {
      // deploying the front before the back, /auth/refresh answers 404. Every failed refresh takes
      // the same path - replay once, then surface the error - so the status is never special cased.
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

    it('should ignore a request outside the api', () => {
      const outcome = call('/assets/i18n/global-en.json');

      httpMock.expectOne('/assets/i18n/global-en.json').flush(...unauthorized());

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(outcome.error?.status).toBe(401);
    });

    it('should not refresh during server side rendering', () => {
      // the server cannot plumb the renewed Set-Cookie back to the browser, and its calls share
      // one IP against the rate limit. The browser refreshes after hydration.
      configure('server');
      const outcome = call();

      httpMock.expectOne(USER_URL).flush(...unauthorized());

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(outcome.error?.status).toBe(401);
    });
  });
});

/** the interceptor must not depend on FlApiService, which would create a DI cycle via HttpClient */
describe('HaHttpRefreshInterceptorService dependencies', () => {
  it('should resolve without FlApiService provided', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        HaHttpRefreshInterceptorService,
        { provide: FlApiServiceConfig, useValue: { getApiUrl: (): string => 'http://api.test/' } },
        { provide: HaAuthService, useValue: {} },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });

    expect(TestBed.inject(HaHttpRefreshInterceptorService)).toBeTruthy();
  });
});
