import { HttpErrorResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { HaAuthenticatedUserService } from '../../ha-service/ha-authenticated-user.service';
import { HaApiErrorService } from './ha-api-error.service';

describe('HaApiErrorService', () => {
  let service: HaApiErrorService;
  /** stateful on purpose: clean() must really drop the user, see the disarming test */
  let currentUser: { id: string } | null;
  let authUserServiceFake: {
    getCurrentUser: () => { id: string } | null;
    clean: ReturnType<typeof vi.fn>;
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

    currentUser = null;
    authUserServiceFake = {
      getCurrentUser: () => currentUser,
      clean: vi.fn(() => {
        currentUser = null;
      }),
    };

    TestBed.configureTestingModule({
      providers: [
        HaApiErrorService,
        // FlCookieService is deliberately NOT provided: the end of a session must never be decided
        // from a browser side cookie, so any code reading one here fails with a NullInjectorError.
        { provide: HaAuthenticatedUserService, useValue: authUserServiceFake },
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
    beforeEach(() => (currentUser = { id: 'user-1' }));

    it('should end the session on a protected route 401', () => {
      // protected routes answer 'error.unauthorized', only /auth/refresh answers
      // 'error.wrong_token'. Keying on the code would make this branch dead code.
      handle(PROTECTED_ROUTE_401);

      expect(authUserServiceFake.clean).toHaveBeenCalled();
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
      expect(authUserServiceFake.clean).not.toHaveBeenCalled();
    });

    it('should not end the session when the refresh itself fails', () => {
      // the interceptor owns that decision, it still has a replay to try
      handle(REFRESH_401);

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should ask for a single reload when several 401 are in flight', () => {
      // a page firing several calls sees them all fail together. Ending the session drops the user,
      // which disarms the branch for the ones that land next.
      handle(PROTECTED_ROUTE_401);
      handle(PROTECTED_ROUTE_401);

      expect(reloadSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('when there was no session to lose', () => {
    it('should not reload on a 401', () => {
      // an anonymous visitor gets a 401 on every authenticated endpoint. Reloading would produce
      // the same 401 on the next load, forever.
      handle(PROTECTED_ROUTE_401);

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should not reload on a 401 while the user is not resolved yet', () => {
      // the /user call of the app initializer fails this way when the session really is over: no
      // user was ever resolved, and reloading would loop on the very next load.
      currentUser = null;

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
      currentUser = { id: 'user-1' };

      handle(new HttpErrorResponse({ status: 500, error: {} }));

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should not reload on a 429', () => {
      // "retry later" is never the end of a session
      currentUser = { id: 'user-1' };

      handle(new HttpErrorResponse({ status: 429, error: {} }));

      expect(reloadSpy).not.toHaveBeenCalled();
    });
  });
});
