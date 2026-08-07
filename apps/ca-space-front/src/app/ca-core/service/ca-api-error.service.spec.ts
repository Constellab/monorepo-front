import { PlatformLocation } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FlApiServiceConfig } from '@monorepo/front-core-lib/fl-api';
import { FL_AUTH_EXPIRED_COOKIE } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { CaAuthSessionService } from '../../ca-login/service/ca-auth-session.service';
import { CaApiErrorService } from './ca-api-error.service';

describe('CaApiErrorService', () => {
  const API_URL = 'http://api.test/';
  const COMMUNITY_URL = 'http://community-api.test/';

  let service: CaApiErrorService;
  let routerSpy: { navigate: ReturnType<typeof vi.fn>; url: string };
  let cookieServiceSpy: { removeCookie: ReturnType<typeof vi.fn> };
  /** the interceptor already tried to renew by the time an error reaches this service */
  let sessionServiceSpy: { isSessionOver: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerSpy = { navigate: vi.fn(), url: '/app/dashboard' };
    cookieServiceSpy = { removeCookie: vi.fn() };
    sessionServiceSpy = { isSessionOver: vi.fn().mockReturnValue(true) };

    TestBed.configureTestingModule({
      providers: [
        CaApiErrorService,
        { provide: Router, useValue: routerSpy },
        { provide: FlCookieService, useValue: cookieServiceSpy },
        { provide: PlatformLocation, useValue: { pathname: '/app/dashboard' } },
        { provide: FlApiServiceConfig, useValue: { getApiUrl: () => API_URL } },
        { provide: CaAuthSessionService, useValue: sessionServiceSpy },
        { provide: FlSnackBarService, useValue: { openErrorMessage: vi.fn() } },
        { provide: FlTranslateService, useValue: { translate: (key: string) => key } },
      ],
    });

    service = TestBed.inject(CaApiErrorService);
  });

  /** run an error through the service and report whether it ended the session */
  function handle(status: number, url: string, code: string = 'error.unauthorized'): boolean {
    const response = new HttpErrorResponse({
      status,
      statusText: 'Error',
      url,
      error: { code, detail: code, instanceId: 'x', status },
    });

    service.handleServerError(response, true).subscribe({ error: () => undefined });

    return routerSpy.navigate.mock.calls.length > 0;
  }

  describe('the end of a session', () => {
    it('should send the user back to the login page on a 401', () => {
      // the interceptor already refreshed and replayed by the time this 401 arrives, so it really
      // is the end of the session
      expect(handle(401, `${API_URL}users/current`)).toBe(true);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { autoRedirect: false },
      });
    });

    it('should clear the session marker so nothing keeps claiming a session', () => {
      handle(401, `${API_URL}users/current`);

      expect(cookieServiceSpy.removeCookie).toHaveBeenCalledWith(
        FL_AUTH_EXPIRED_COOKIE,
        expect.objectContaining({ path: '/' })
      );
    });

    it('should not depend on the error code the api happens to send', () => {
      // branching on 'error.wrong_token' made this inert the day the api answered another code,
      // and the symptom only showed up minutes into a real session
      expect(handle(401, `${API_URL}users/current`, 'error.some_new_code')).toBe(true);
    });

    it('should not redirect twice when already on the login page', () => {
      routerSpy.url = '/login';

      handle(401, `${API_URL}users/current`);

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('what must never end a session', () => {
    it.each(['auth/login', 'auth/login-2fa', 'auth/refresh'])('a 401 from %s', (route) => {
      // wrong credentials, or a rotation another tab won: neither says the session is over, and
      // the interceptor still has a replay to try
      expect(handle(401, `${API_URL}${route}`)).toBe(false);
    });

    it('a 401 from the community api', () => {
      // it owns its own credentials, its 401 says nothing about the space session
      expect(handle(401, `${COMMUNITY_URL}brick`)).toBe(false);
    });

    it.each([403, 404, 429, 500])('a %s from the space api', (status) => {
      // a 429 in particular means "retry later", never "you are logged out"
      expect(handle(status, `${API_URL}users/current`)).toBe(false);
    });

    it('a 401 the renewal could not explain away', () => {
      // the API answers 401 for an object the user may not touch as well as for a dead token.
      // Refused again after the pair WAS renewed means the first: throwing the user out of the app
      // over a permission error would be a worse bug than the one this whole change fixes.
      sessionServiceSpy.isSessionOver.mockReturnValue(false);

      expect(handle(401, `${API_URL}folders/xyz`)).toBe(false);
    });
  });
});
