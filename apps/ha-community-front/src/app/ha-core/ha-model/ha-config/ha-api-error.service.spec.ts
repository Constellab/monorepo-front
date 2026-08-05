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

  /** a 401 as the api formats it when the access token is missing or expired */
  const WRONG_TOKEN = new HttpErrorResponse({
    status: 401,
    error: {
      status: 401,
      code: 'error.wrong_token',
      detail: 'error.wrong_token',
      instanceId: 'x',
    },
  });

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

    it('should end the session and reload', () => {
      handle(WRONG_TOKEN);

      expect(cookieServiceSpy.removeCookie).toHaveBeenCalledWith(FL_AUTH_EXPIRED_COOKIE);
      expect(reloadSpy).toHaveBeenCalled();
    });
  });

  describe('when there was no session to lose', () => {
    it('should not reload on a 401', () => {
      // an anonymous visitor gets a 401 on every authenticated endpoint. Reloading would produce
      // the same 401 on the next load, forever.
      handle(WRONG_TOKEN);

      expect(reloadSpy).not.toHaveBeenCalled();
    });

    it('should still propagate the error', () => {
      const onError = vi.fn();
      service.handleServerError(WRONG_TOKEN).subscribe({ error: onError });

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
