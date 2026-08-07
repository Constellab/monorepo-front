import { Location } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { of, throwError } from 'rxjs';

import { HaEnvironmentHelper } from '../../ha-core/ha-model/ha-config/ha-environment.helper';
import { HaAuthService } from '../../ha-core/ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRefreshCoordinatorService } from '../../ha-core/ha-service/ha-refresh-coordinator.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaLoginPageComponent } from './ha-login-page.component';

describe('HaLoginPageComponent', () => {
  const OAUTH_RETURN_URL = `${HaEnvironmentHelper.getApiUrl()}/oauth/authorize?response_type=code&state=xyz`;

  let authServiceSpy: { refresh: ReturnType<typeof vi.fn> };
  let coordinatorSpy: { coordinate: ReturnType<typeof vi.fn> };
  let authenticatedUserServiceSpy: {
    isAuthenticatedOnce: ReturnType<typeof vi.fn>;
    init: ReturnType<typeof vi.fn>;
  };
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };
  let assignSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { assign: assignSpy },
      writable: true,
      configurable: true,
    });

    authServiceSpy = {
      refresh: vi.fn().mockReturnValue(of({ status: 'LOGGED_IN', expiresIn: 900000 })),
    };
    // pass through: the cross-tab behaviour has its own spec. Providing it also keeps the real one
    // from leaking its "refreshed recently" timestamp from one test to the next.
    coordinatorSpy = {
      coordinate: vi.fn((refresh: () => unknown) => refresh()),
    };
    authenticatedUserServiceSpy = {
      isAuthenticatedOnce: vi.fn().mockReturnValue(of(false)),
      init: vi.fn(),
    };
    routerSpy = { navigate: vi.fn() };
  });

  /** build the component with its template stripped, only its logic is under test */
  function createComponent(queryParams: Params = {}): HaLoginPageComponent {
    TestBed.configureTestingModule({
      imports: [HaLoginPageComponent],
      providers: [
        { provide: HaAuthService, useValue: authServiceSpy },
        { provide: HaRefreshCoordinatorService, useValue: coordinatorSpy },
        { provide: HaAuthenticatedUserService, useValue: authenticatedUserServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: Location, useValue: { back: vi.fn() } },
        { provide: FlSnackBarService, useValue: { openErrorMessage: vi.fn(), openSuccessMessage: vi.fn() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParams }, queryParams: of(queryParams) },
        },
      ],
    });
    TestBed.overrideComponent(HaLoginPageComponent, { set: { template: '', imports: [] } });

    const fixture = TestBed.createComponent(HaLoginPageComponent);
    fixture.detectChanges();
    return fixture.componentInstance;
  }

  describe('resuming an OAuth flow', () => {
    it('should refresh before redirecting to the authorize url', () => {
      // only the api knows whether the session is alive. Redirecting with an expired access token
      // sends the user back to /login?returnUrl=... : an infinite loop between the front and the api.
      createComponent({ returnUrl: OAUTH_RETURN_URL });

      expect(authServiceSpy.refresh).toHaveBeenCalledTimes(1);
      expect(assignSpy).toHaveBeenCalledWith(OAUTH_RETURN_URL);
    });

    it('should refresh through the coordinator, never straight to the api', () => {
      // an MCP client opens this page in a fresh tab while the app is very likely already running in
      // another. Two refreshes colliding make the API delete the session for both.
      createComponent({ returnUrl: OAUTH_RETURN_URL });

      expect(coordinatorSpy.coordinate).toHaveBeenCalledTimes(1);
    });

    it('should redirect when the coordinator skipped a redundant refresh', () => {
      // another tab renewed the pair a moment ago, so the session is alive: that answers the
      // question just as well as a refresh of our own
      coordinatorSpy.coordinate.mockReturnValue(of(null));

      createComponent({ returnUrl: OAUTH_RETURN_URL });

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(assignSpy).toHaveBeenCalledWith(OAUTH_RETURN_URL);
    });

    it('should show the form when the refresh fails', () => {
      authServiceSpy.refresh.mockReturnValue(throwError(() => new Error('session over')));

      createComponent({ returnUrl: OAUTH_RETURN_URL });

      expect(assignSpy).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });

    it('should ignore an unsafe returnUrl', () => {
      authenticatedUserServiceSpy.isAuthenticatedOnce.mockReturnValue(of(true));

      createComponent({ returnUrl: 'https://phishing.example/oauth/authorize' });

      expect(assignSpy).not.toHaveBeenCalled();
      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith([HaRouterService.getHomeRoute()]);
    });

    it('should redirect after a successful login', () => {
      authServiceSpy.refresh.mockReturnValue(throwError(() => new Error('anonymous')));
      const component = createComponent({ returnUrl: OAUTH_RETURN_URL });
      assignSpy.mockClear();

      component.onLoginSuccess();

      expect(assignSpy).toHaveBeenCalledWith(OAUTH_RETURN_URL);
    });
  });

  describe('without an OAuth flow', () => {
    it('should send an already logged in user home', () => {
      authenticatedUserServiceSpy.isAuthenticatedOnce.mockReturnValue(of(true));

      createComponent();

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith([HaRouterService.getHomeRoute()]);
    });

    it('should show the form to an anonymous visitor', () => {
      createComponent();

      expect(authServiceSpy.refresh).not.toHaveBeenCalled();
      expect(routerSpy.navigate).not.toHaveBeenCalled();
      expect(assignSpy).not.toHaveBeenCalled();
    });

    it('should wait for the authoritative answer, not a cookie', () => {
      createComponent();

      expect(authenticatedUserServiceSpy.isAuthenticatedOnce).toHaveBeenCalled();
    });
  });
});
