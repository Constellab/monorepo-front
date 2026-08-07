import { PlatformLocation } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { isObservable, of, throwError } from 'rxjs';

import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../ha-service/ha-router.service';
import { HaStoryService } from '../ha-service/ha-story.service';
import { HaStoryGuard } from './ha-story.guard';

describe('HaStoryGuard', () => {
  const LOGIN_TREE = {} as UrlTree;
  const GUARDED_ROUTE = '/story/abc/edit';
  const STORY_ID = 'abc';

  let routerSpy: { createUrlTree: ReturnType<typeof vi.fn> };
  let authUserServiceSpy: {
    isAuthenticatedOnce: ReturnType<typeof vi.fn>;
    hasSessionMarkerOnServer: ReturnType<typeof vi.fn>;
    isAdmin: ReturnType<typeof vi.fn>;
  };
  let storyServiceSpy: { isStoryOwnerOrCoAuthor: ReturnType<typeof vi.fn> };

  /** what FlApiService rethrows once HaApiErrorService handled the response */
  function serverError(status: number): FlServerError {
    return { response: new HttpErrorResponse({ status }), message: 'error' };
  }

  const ROUTE = {
    paramMap: { get: (): string => STORY_ID },
  } as unknown as ActivatedRouteSnapshot;

  function build(platform: 'browser' | 'server'): HaStoryGuard {
    TestBed.resetTestingModule();
    routerSpy = { createUrlTree: vi.fn().mockReturnValue(LOGIN_TREE) };
    authUserServiceSpy = {
      isAuthenticatedOnce: vi.fn().mockReturnValue(of(true)),
      hasSessionMarkerOnServer: vi.fn().mockReturnValue(false),
      isAdmin: vi.fn().mockReturnValue(of(false)),
    };
    storyServiceSpy = { isStoryOwnerOrCoAuthor: vi.fn().mockReturnValue(of(true)) };

    TestBed.configureTestingModule({
      providers: [
        HaStoryGuard,
        { provide: Router, useValue: routerSpy },
        { provide: HaAuthenticatedUserService, useValue: authUserServiceSpy },
        { provide: HaStoryService, useValue: storyServiceSpy },
        { provide: PlatformLocation, useValue: { pathname: GUARDED_ROUTE } },
        { provide: PLATFORM_ID, useValue: platform },
      ],
    });

    return TestBed.inject(HaStoryGuard);
  }

  /**
   * Set when canActivate errored instead of answering. Never assert this with toThrow(): rxjs
   * reports an error thrown from a subscriber asynchronously, so the expectation would pass whatever
   * the guard does.
   */
  let activationError: unknown;

  /** resolve whatever shape canActivate returned */
  function activate(guard: HaStoryGuard): boolean | UrlTree {
    activationError = undefined;
    const result = guard.canActivate(ROUTE);
    if (isObservable(result)) {
      let resolved: boolean | UrlTree;
      result.subscribe({
        next: (value) => (resolved = value),
        // the error may itself be undefined, keep a truthy trace of it
        error: (error) => (activationError = error ?? 'errored'),
      });
      return resolved;
    }
    return result as boolean | UrlTree;
  }

  beforeEach(() => FlLoginSavedRoute.clearRoute());

  describe('on the browser', () => {
    it('should let a co-author through', () => {
      const guard = build('browser');

      expect(activate(guard)).toBe(true);
      expect(storyServiceSpy.isStoryOwnerOrCoAuthor).toHaveBeenCalledWith(STORY_ID);
    });

    it('should let an admin through without asking the story', () => {
      const guard = build('browser');
      authUserServiceSpy.isAdmin.mockReturnValue(of(true));

      expect(activate(guard)).toBe(true);
      expect(storyServiceSpy.isStoryOwnerOrCoAuthor).not.toHaveBeenCalled();
    });

    it('should wait for the authoritative answer instead of reading a cookie', () => {
      const guard = build('browser');

      activate(guard);

      expect(authUserServiceSpy.isAuthenticatedOnce).toHaveBeenCalled();
      expect(authUserServiceSpy.hasSessionMarkerOnServer).not.toHaveBeenCalled();
    });

    it('should send an anonymous visitor to the login page', () => {
      const guard = build('browser');
      authUserServiceSpy.isAuthenticatedOnce.mockReturnValue(of(false));

      expect(activate(guard)).toBe(LOGIN_TREE);
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith([HaRouterService.getLoginRoute()]);
    });

    it('should block a user who may not edit the story', () => {
      const guard = build('browser');
      storyServiceSpy.isStoryOwnerOrCoAuthor.mockReturnValue(of(false));

      expect(activate(guard)).toBe(false);
    });

    it('should save the route to come back to after login', () => {
      const guard = build('browser');
      authUserServiceSpy.isAuthenticatedOnce.mockReturnValue(of(false));

      activate(guard);

      expect(FlLoginSavedRoute.getRoutePath()).toBe(GUARDED_ROUTE);
    });
  });

  describe('during server side rendering', () => {
    it('should redirect without a marker cookie', () => {
      const guard = build('server');

      expect(activate(guard)).toBe(LOGIN_TREE);
      expect(storyServiceSpy.isStoryOwnerOrCoAuthor).not.toHaveBeenCalled();
    });

    it('should check the rights when the marker says a session may exist', () => {
      const guard = build('server');
      authUserServiceSpy.hasSessionMarkerOnServer.mockReturnValue(true);

      expect(activate(guard)).toBe(true);
      expect(authUserServiceSpy.isAuthenticatedOnce).not.toHaveBeenCalled();
    });
  });

  describe('when the rights check cannot be answered', () => {
    beforeEach(() => FlLoginSavedRoute.clearRoute());

    it('should let the route through on a 401 rather than conclude', () => {
      // during SSR the forwarded access token is expired and the server cannot renew it: a 401 is
      // the normal answer for a valid 30 day session. The browser guard settles it after hydration.
      const guard = build('server');
      authUserServiceSpy.hasSessionMarkerOnServer.mockReturnValue(true);
      storyServiceSpy.isStoryOwnerOrCoAuthor.mockReturnValue(throwError(() => serverError(401)));

      expect(activate(guard)).toBe(true);
    });

    it('should not take the render down with it', () => {
      // without a catchError the guard observable errors and the whole server render fails
      const guard = build('server');
      authUserServiceSpy.hasSessionMarkerOnServer.mockReturnValue(true);
      storyServiceSpy.isStoryOwnerOrCoAuthor.mockReturnValue(throwError(() => serverError(500)));

      activate(guard);

      expect(activationError).toBeUndefined();
    });

    it('should redirect on a failure that is not a missing credential', () => {
      const guard = build('server');
      authUserServiceSpy.hasSessionMarkerOnServer.mockReturnValue(true);
      storyServiceSpy.isStoryOwnerOrCoAuthor.mockReturnValue(throwError(() => serverError(500)));

      expect(activate(guard)).toBe(LOGIN_TREE);
    });

    it('should survive an error carrying no response', () => {
      const guard = build('browser');
      storyServiceSpy.isStoryOwnerOrCoAuthor.mockReturnValue(throwError(() => undefined));

      expect(activate(guard)).toBe(LOGIN_TREE);
    });
  });
});
