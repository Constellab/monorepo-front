import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ClDateHelper } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FL_AUTH_EXPIRED_COOKIE } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { of } from 'rxjs';

import { CaAuthService } from './ca-auth.service';
import { CaAuthSessionService } from './ca-auth-session.service';

describe('CaAuthService', () => {
  /** what the api returns for the access token: 15 minutes */
  const ACCESS_TOKEN_EXPIRES_IN = 900000;
  /** the refresh token duration of the api, the marker must outlive it */
  const REFRESH_TOKEN_DURATION_MS = 30 * ClDateHelper.ONE_DAY;

  const API_URL = 'http://api.test/';

  let service: CaAuthService;
  let httpMock: HttpTestingController;
  let apiServiceSpy: {
    post: ReturnType<typeof vi.fn>;
    getBaseRouteUrl: ReturnType<typeof vi.fn>;
  };
  let cookieServiceSpy: {
    setCookie: ReturnType<typeof vi.fn>;
    removeCookie: ReturnType<typeof vi.fn>;
    check: ReturnType<typeof vi.fn>;
  };
  let sessionServiceSpy: { schedule: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    apiServiceSpy = {
      post: vi.fn().mockReturnValue(of({})),
      getBaseRouteUrl: vi.fn().mockImplementation((route: string) => API_URL + route),
    };
    cookieServiceSpy = {
      setCookie: vi.fn(),
      removeCookie: vi.fn(),
      check: vi.fn().mockReturnValue(false),
    };
    sessionServiceSpy = { schedule: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        CaAuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: FlApiService, useValue: apiServiceSpy },
        { provide: FlCookieService, useValue: cookieServiceSpy },
        { provide: CaAuthSessionService, useValue: sessionServiceSpy },
      ],
    });
    service = TestBed.inject(CaAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** expiration date of the marker cookie of the last setCookie call */
  function getStoredMarkerExpiration(): Date {
    const call = cookieServiceSpy.setCookie.mock.calls.find(
      ([key]: [string]) => key === FL_AUTH_EXPIRED_COOKIE
    );
    if (call === undefined) {
      throw new Error('setCookie was not called with the session marker cookie');
    }
    return call[2].expires;
  }

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('afterLogin', () => {
    it('should store the session marker cookie', () => {
      service.afterLogin(ACCESS_TOKEN_EXPIRES_IN);

      expect(cookieServiceSpy.setCookie).toHaveBeenCalledWith(
        FL_AUTH_EXPIRED_COOKIE,
        expect.anything(),
        expect.objectContaining({ path: '/' })
      );
    });

    it('should outlive the refresh token, not the access token', () => {
      const before = Date.now();

      service.afterLogin(ACCESS_TOKEN_EXPIRES_IN);

      // the marker only ever gates "this visitor certainly has no session". Expiring it with the
      // 15 min access token would send back to the login page a user whose session lives 30 days.
      const expiration = getStoredMarkerExpiration().getTime();
      expect(expiration).toBeGreaterThanOrEqual(before + REFRESH_TOKEN_DURATION_MS);
    });

    it('should arm the proactive renewal with the announced lifetime', () => {
      // expiresIn is the only thing the app ever learns about the expiry: the tokens live in
      // httpOnly cookies, and nothing else says when they die.
      service.afterLogin(ACCESS_TOKEN_EXPIRES_IN);

      expect(sessionServiceSpy.schedule).toHaveBeenCalledWith(ACCESS_TOKEN_EXPIRES_IN);
    });

    it('should ignore expiresIn to compute the marker duration', () => {
      service.afterLogin(1);
      const shortLived = getStoredMarkerExpiration().getTime();

      cookieServiceSpy.setCookie.mockClear();
      service.afterLogin(ACCESS_TOKEN_EXPIRES_IN);
      const longLived = getStoredMarkerExpiration().getTime();

      expect(Math.abs(longLived - shortLived)).toBeLessThan(ClDateHelper.ONE_MINUTE);
    });
  });

  describe('refresh', () => {
    const REFRESH_URL = `${API_URL}auth/refresh`;

    it('should post to auth/refresh', () => {
      service.refresh().subscribe();

      const request = httpMock.expectOne(REFRESH_URL);
      expect(request.request.method).toBe('POST');
      request.flush({ status: 'LOGGED_IN', expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    });

    it('should send the credential cookies', () => {
      service.refresh().subscribe();

      const request = httpMock.expectOne(REFRESH_URL);
      expect(request.request.withCredentials).toBe(true);
      request.flush({ status: 'LOGGED_IN', expiresIn: ACCESS_TOKEN_EXPIRES_IN });
    });

    it('should not go through the FlApiService error pipeline', () => {
      // a 401 handled by FlApiService reaches CaApiErrorService, which sends the user back to the
      // login page - the interceptor would never get to replay the request that failed.
      service.refresh().subscribe({ error: (): void => undefined });

      httpMock
        .expectOne(REFRESH_URL)
        .flush(
          { status: 401, code: 'error.wrong_token', detail: 'error.wrong_token', instanceId: 'x' },
          { status: 401, statusText: 'Unauthorized' }
        );

      expect(apiServiceSpy.post).not.toHaveBeenCalled();
    });

    it('should renew the session marker on success', () => {
      service.refresh().subscribe();
      httpMock.expectOne(REFRESH_URL).flush({ status: 'LOGGED_IN', expiresIn: ACCESS_TOKEN_EXPIRES_IN });

      const expiration = getStoredMarkerExpiration().getTime();
      expect(expiration).toBeGreaterThanOrEqual(Date.now() + REFRESH_TOKEN_DURATION_MS);
    });

    it('should re-arm the renewal from the answer', () => {
      // each refresh only announces the next lifetime, so the chain has to feed itself
      service.refresh().subscribe();
      httpMock.expectOne(REFRESH_URL).flush({ status: 'LOGGED_IN', expiresIn: ACCESS_TOKEN_EXPIRES_IN });

      expect(sessionServiceSpy.schedule).toHaveBeenCalledWith(ACCESS_TOKEN_EXPIRES_IN);
    });

    it('should propagate the error on failure', () => {
      const onError = vi.fn();
      service.refresh().subscribe({ error: onError });

      httpMock.expectOne(REFRESH_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(onError).toHaveBeenCalled();
    });

    it('should leave the session marker untouched on failure', () => {
      // a failed refresh does not prove the session is over: another tab may have just consumed
      // the single-use refresh token and hold a valid session. Clearing the marker here would
      // make it lie in the one direction it must never lie. The caller decides.
      service.refresh().subscribe({ error: (): void => undefined });

      httpMock.expectOne(REFRESH_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(cookieServiceSpy.removeCookie).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should end the session on the api, not only in the browser', () => {
      // clearing the cookies alone would leave a refresh token the API still honours
      service.logout().subscribe();

      expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/logout', null);
      expect(cookieServiceSpy.removeCookie).toHaveBeenCalledWith(
        FL_AUTH_EXPIRED_COOKIE,
        expect.objectContaining({ path: '/' })
      );
    });
  });
});
