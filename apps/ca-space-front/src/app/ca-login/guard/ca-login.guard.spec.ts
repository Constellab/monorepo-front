import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CaOauthReturnUrlService } from '../../ca-core/service/ca-oauth-return-url.service';
import { CaAuthenticatedUserService } from '../../ca-core/service-api/ca-authenticated-user.service';
import { CaAuthService } from '../service/ca-auth.service';
import { CaAuthSessionService } from '../service/ca-auth-session.service';
import { CaLoginGuard } from './ca-login.guard';

describe('CaLoginGuard', () => {
  const APP_URL_TREE = {} as UrlTree;
  const AUTHORIZE_URL = 'http://localhost:3001/oauth/authorize?client_id=e068a0e3&state=xyz';

  let guard: CaLoginGuard;
  let authServiceSpy: { hasAuthorizationCookie: ReturnType<typeof vi.fn> };
  let sessionServiceSpy: { resume: ReturnType<typeof vi.fn> };
  let userServiceSpy: { hasLiveSession: ReturnType<typeof vi.fn> };
  let routerSpy: { createUrlTree: ReturnType<typeof vi.fn> };
  let returnUrlServiceSpy: {
    getSafeAuthorizeReturnUrl: ReturnType<typeof vi.fn>;
    resume: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    authServiceSpy = { hasAuthorizationCookie: vi.fn().mockReturnValue(true) };
    sessionServiceSpy = { resume: vi.fn().mockReturnValue(of(undefined)) };
    userServiceSpy = { hasLiveSession: vi.fn().mockReturnValue(of(true)) };
    routerSpy = { createUrlTree: vi.fn().mockReturnValue(APP_URL_TREE) };
    // no return url by default: the ordinary login
    returnUrlServiceSpy = { getSafeAuthorizeReturnUrl: vi.fn().mockReturnValue(null), resume: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        CaLoginGuard,
        { provide: CaAuthService, useValue: authServiceSpy },
        { provide: CaAuthSessionService, useValue: sessionServiceSpy },
        { provide: CaAuthenticatedUserService, useValue: userServiceSpy },
        { provide: CaOauthReturnUrlService, useValue: returnUrlServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(CaLoginGuard);
  });

  /** activate the login route and report what the guard answered */
  function activate(queryParams: Record<string, string> = {}): boolean | UrlTree {
    const result = guard.canActivate({ queryParams } as unknown as ActivatedRouteSnapshot);
    if (!(result instanceof Observable)) {
      return result as boolean | UrlTree;
    }

    let resolved: boolean | UrlTree;
    result.subscribe((value: boolean | UrlTree) => (resolved = value));
    return resolved;
  }

  it('should send a user with a live session into the app', () => {
    expect(activate()).toBe(APP_URL_TREE);
  });

  it('should keep a user whose session ended on the login page', () => {
    // the marker outlives the session on purpose, so one left behind by a session that ended weeks
    // ago must not send its owner into the app just to be thrown back here with a "session expired"
    userServiceSpy.hasLiveSession.mockReturnValue(of(false));

    expect(activate()).toBe(true);
  });

  it('should renew before asking, so an expired token does not read as a dead session', () => {
    activate();

    expect(sessionServiceSpy.resume).toHaveBeenCalledTimes(1);
    expect(userServiceSpy.hasLiveSession).toHaveBeenCalledTimes(1);
  });

  it('should spend no call when no marker suggests a session', () => {
    // everyone arriving at the login page to log in: the one question a cookie may answer
    authServiceSpy.hasAuthorizationCookie.mockReturnValue(false);

    expect(activate()).toBe(true);
    expect(sessionServiceSpy.resume).not.toHaveBeenCalled();
    expect(userServiceSpy.hasLiveSession).not.toHaveBeenCalled();
  });

  it('should stand aside when sent here by a session that just ended', () => {
    // CaApiErrorService redirects with autoRedirect=false, and asking again would bounce the user
    // straight back into the app they were just thrown out of
    expect(activate({ autoRedirect: 'false' })).toBe(true);
    expect(userServiceSpy.hasLiveSession).not.toHaveBeenCalled();
  });

  describe('with a return url', () => {
    beforeEach(() => returnUrlServiceSpy.getSafeAuthorizeReturnUrl.mockReturnValue(AUTHORIZE_URL));

    it('should resume the authorization flow instead of entering the app', () => {
      // the API only sends a visitor here when it found no valid session, but its own access token
      // may merely have expired while the session is alive. Entering the app would leave the client
      // waiting forever for a flow nothing comes back to.
      const result = activate({ returnUrl: AUTHORIZE_URL });

      expect(returnUrlServiceSpy.resume).toHaveBeenCalledWith(AUTHORIZE_URL);
      // the browser is leaving the app, so the router must not route anywhere
      expect(result).toBe(false);
      expect(routerSpy.createUrlTree).not.toHaveBeenCalled();
    });

    it('should show the login form when there is no session to resume with', () => {
      userServiceSpy.hasLiveSession.mockReturnValue(of(false));

      expect(activate({ returnUrl: AUTHORIZE_URL })).toBe(true);
      expect(returnUrlServiceSpy.resume).not.toHaveBeenCalled();
    });

    it('should show the login form when no marker suggests a session', () => {
      authServiceSpy.hasAuthorizationCookie.mockReturnValue(false);

      expect(activate({ returnUrl: AUTHORIZE_URL })).toBe(true);
      expect(returnUrlServiceSpy.resume).not.toHaveBeenCalled();
    });

    it('should enter the app when the return url is not a safe target', () => {
      // anything that is not the API's authorize endpoint falls back to the default landing page
      returnUrlServiceSpy.getSafeAuthorizeReturnUrl.mockReturnValue(null);

      expect(activate({ returnUrl: 'https://phishing.example' })).toBe(APP_URL_TREE);
      expect(returnUrlServiceSpy.resume).not.toHaveBeenCalled();
    });
  });
});
