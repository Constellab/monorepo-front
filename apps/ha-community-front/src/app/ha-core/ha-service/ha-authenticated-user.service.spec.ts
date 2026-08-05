import { PLATFORM_ID, REQUEST } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FL_AUTH_EXPIRED_COOKIE } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { of, throwError } from 'rxjs';

import { HaUser } from '../ha-model/ha-entities/ha-user';
import { HaAuthenticatedUserService } from './ha-authenticated-user.service';

describe('HaAuthenticatedUserService', () => {
  const USER = { id: 'user-1', lang: 'en' } as unknown as HaUser;

  let apiServiceSpy: { get: ReturnType<typeof vi.fn>; put: ReturnType<typeof vi.fn> };

  function build(
    platform: 'browser' | 'server',
    cookies: Record<string, string> = null
  ): HaAuthenticatedUserService {
    TestBed.resetTestingModule();
    apiServiceSpy = {
      get: vi.fn().mockReturnValue(of(USER)),
      put: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        HaAuthenticatedUserService,
        { provide: FlApiService, useValue: apiServiceSpy },
        { provide: FlTranslateService, useValue: { changeAppLanguage: vi.fn() } },
        { provide: FlSnackBarService, useValue: { openSuccessMessage: vi.fn() } },
        { provide: PLATFORM_ID, useValue: platform },
        { provide: REQUEST, useValue: cookies ? { cookies } : null },
      ],
    });

    return TestBed.inject(HaAuthenticatedUserService);
  }

  describe('init on the browser', () => {
    it('should ask the api even without a marker cookie', () => {
      // the api is the authority: an expired access token is renewed by the refresh interceptor,
      // so a cookie must never decide whether the call is worth making.
      const service = build('browser');

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

  describe('init during server side rendering', () => {
    it('should skip the call without a marker cookie', () => {
      // the server cannot refresh an expired access token, so the marker is its only signal
      const service = build('server');

      service.init();

      expect(apiServiceSpy.get).not.toHaveBeenCalled();
      expect(service.getCurrentUser()).toBeNull();
    });

    it('should ask the api with a marker cookie', () => {
      const service = build('server', { [FL_AUTH_EXPIRED_COOKIE]: '123' });

      service.init();

      expect(apiServiceSpy.get).toHaveBeenCalledWith('user');
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
