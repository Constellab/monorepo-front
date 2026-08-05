import { HttpErrorResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FL_AUTH_EXPIRED_COOKIE } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { HaApiErrorService } from './ha-api-error.service';

describe('HaApiErrorService', () => {
  let service: HaApiErrorService;
  let cookieServiceSpy: {
    check: ReturnType<typeof vi.fn>;
    removeCookie: ReturnType<typeof vi.fn>;
  };
  let reloadSpy: ReturnType<typeof vi.fn>;

  /** the api uses two different codes for a 401, see unauthorized() below */
  function unauthorized(code: string, url: string = 'http://api.test/user'): HttpErrorResponse {
    return new HttpErrorResponse({
      status: 401,
      url,
      error: { status: 401, code, detail: code, instanceId: 'x' },
    });
  }

  /** what a protected route answers once the access token expired */
  const PROTECTED_ROUTE_401 = unauthorized('error.unauthorized');
  /** what /auth/refresh answers when it cannot renew */
  const REFRESH_401 = unauthorized('error.wrong_token', 'http://api.test/auth/refresh');

  beforeEach(() => {
    reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: reloadSpy },
      writable: true,
      configurable: true,
    });

    cookieServiceSpy = {
      check: vi.fn().mockReturnValue(false),
      removeCookie: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        HaApiErrorService,
        { provide: FlCookieService, useValue: cookieServiceSpy },
        { provide: FlSnackBarService, useValue: { openErrorMessage: vi.fn() } },
        { provide: FlTranslateService, useValue: { translate: (key: string): string => key } },
        { provide: PLATFORM_ID, useValue: 'browser' },
      ],
    });
    service = TestBed.inject(HaApiErrorService);
  });

  function handle(error: HttpErrorResponse): void {
    service.handleServerError(error).subscribe({ error: (): void => undefined });
  }

  describe('when a session was believed to exist', () => {
    beforeEach(() => cookieServiceSpy.check.mockReturnValue(true));

    it('should end the session on a protected route 401', () => {
      // protected routes answer 'error.unauthorized', only /auth/refresh answers
      // 'error.wrong_token'. Keying on the code would make this branch dead code.
      handle(PROTECTED_ROUTE_401);

      expect(cookieServiceSpy.removeCookie).toHaveBeenCalledWith(FL_AUTH_EXPIRED_COOKIE);
      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should end the session whatever the code', () => {
      handle(unauthorized('error.some_new_code_the_api_adds_later'));

      expect(reloadSpy).toHaveBeenCalled();
    });

    it('should not end the session on a 401 from an auth route', () => {
      // wrong credentials on /auth/login is a 401 too, and it is not an expired session
      handle(unauthorized('error.wrong_credentials', 'http://api.test/auth/login'));

      expect(reloadSpy).not.toHaveBeenCalled();
      expect(cookieServiceSpy.removeCookie).not.toHaveBeenCalled();
    });

    it('should not end the session when the refresh itself fails', () => {
      // the interceptor owns that decision, it still has a replay to try
      handle(REFRESH_401);

      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });

  describe('when there was no session to lose', () => {
    it('should not reload on a 401', () => {
      // an anonymous visitor gets a 401 on every authenticated endpoint. Reloading would produce
      // the same 401 on the next load, forever.
      handle(PROTECTED_ROUTE_401);

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should still propagate the error', () => {
      const onError = vi.fn();
      service.handleServerError(PROTECTED_ROUTE_401).subscribe({ error: onError });

      expect(onError).toHaveBeenCalled();
    });
  });

  describe('other errors', () => {
    it('should not reload on a 500', () => {
      cookieServiceSpy.check.mockReturnValue(true);

      handle(new HttpErrorResponse({ status: 500, error: {} }));

      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });
});
