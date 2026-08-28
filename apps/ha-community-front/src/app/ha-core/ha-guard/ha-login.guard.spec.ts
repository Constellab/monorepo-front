import { PlatformLocation } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { isObservable, of } from 'rxjs';

import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../ha-service/ha-router.service';
import { HaLoginGuard } from './ha-login.guard';

describe('HaLoginGuard', () => {
  const LOGIN_TREE = {} as UrlTree;
  const GUARDED_ROUTE = '/brick/abc';

  let routerSpy: { createUrlTree: ReturnType<typeof vi.fn> };
  let authenticatedUserServiceSpy: {
    isAuthenticatedOnce: ReturnType<typeof vi.fn>;
    hasSessionMarkerOnServer: ReturnType<typeof vi.fn>;
  };

  function build(platform: 'browser' | 'server'): HaLoginGuard {
    TestBed.resetTestingModule();
    routerSpy = { createUrlTree: vi.fn().mockReturnValue(LOGIN_TREE) };
    authenticatedUserServiceSpy = {
      isAuthenticatedOnce: vi.fn().mockReturnValue(of(true)),
      hasSessionMarkerOnServer: vi.fn().mockReturnValue(false),
    };

    TestBed.configureTestingModule({
      providers: [
        HaLoginGuard,
        { provide: Router, useValue: routerSpy },
        { provide: HaAuthenticatedUserService, useValue: authenticatedUserServiceSpy },
        { provide: PlatformLocation, useValue: { pathname: GUARDED_ROUTE } },
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });

    return TestBed.inject(HaLoginGuard);
  }

  /** resolve whatever shape canActivate returned */
  function activate(guard: HaLoginGuard): boolean | UrlTree | undefined {
    const result = guard.canActivate();
    if (isObservable(result)) {
      let resolved: boolean | UrlTree | undefined;
      result.subscribe((value) => (resolved = value));
      return resolved;
    }
    return result as boolean | UrlTree;
  }

  beforeEach(() => FlLoginSavedRoute.clearRoute());

  describe('on the browser', () => {
    it('should let a logged in user through', () => {
      const guard = build('browser');

      expect(activate(guard)).toBe(true);
    });

    it('should wait for the authoritative answer instead of reading a cookie', () => {
      // an expired access token is renewed behind the scenes, so a cookie would send a logged in
      // user to the login page for nothing
      const guard = build('browser');

      activate(guard);

      expect(authenticatedUserServiceSpy.isAuthenticatedOnce).toHaveBeenCalled();
      expect(authenticatedUserServiceSpy.hasSessionMarkerOnServer).not.toHaveBeenCalled();
    });

    it('should send an anonymous visitor to the login page', () => {
      const guard = build('browser');
      authenticatedUserServiceSpy.isAuthenticatedOnce.mockReturnValue(of(false));

      expect(activate(guard)).toBe(LOGIN_TREE);
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith([HaRouterService.getLoginRoute()]);
    });

    it('should save the route to come back to after login', () => {
      const guard = build('browser');
      authenticatedUserServiceSpy.isAuthenticatedOnce.mockReturnValue(of(false));

      activate(guard);

      expect(FlLoginSavedRoute.getRoutePath()).toBe(GUARDED_ROUTE);
    });
  });

  describe('during server side rendering', () => {
    it('should trust the marker cookie', () => {
      // the server cannot refresh an expired access token, the marker is its only signal
      const guard = build('server');
      authenticatedUserServiceSpy.hasSessionMarkerOnServer.mockReturnValue(true);

      expect(activate(guard)).toBe(true);
      expect(authenticatedUserServiceSpy.isAuthenticatedOnce).not.toHaveBeenCalled();
    });

    it('should redirect without a marker cookie', () => {
      const guard = build('server');

      expect(activate(guard)).toBe(LOGIN_TREE);
    });
  });
});
