import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';

import { CaAuthenticatedUserService } from '../../ca-core/service-api/ca-authenticated-user.service';
import { CaAuthSessionService } from '../../ca-login/service/ca-auth-session.service';
import { CaLoadUserGuard } from './ca-load-user.guard';

describe('CaLoadUserGuard', () => {
  let guard: CaLoadUserGuard;
  let sessionServiceSpy: { resume: ReturnType<typeof vi.fn> };
  let userServiceSpy: { loadCurrentInfo: ReturnType<typeof vi.fn> };
  let routerSpy: { parseUrl: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    sessionServiceSpy = { resume: vi.fn().mockReturnValue(of(undefined)) };
    userServiceSpy = { loadCurrentInfo: vi.fn().mockReturnValue(of({ user: { id: 'user-1' } })) };
    routerSpy = { parseUrl: vi.fn().mockReturnValue({} as UrlTree) };

    TestBed.configureTestingModule({
      providers: [
        CaLoadUserGuard,
        { provide: CaAuthSessionService, useValue: sessionServiceSpy },
        { provide: CaAuthenticatedUserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(CaLoadUserGuard);
  });

  /** activate the route and report what the guard answered */
  function activate(): boolean | UrlTree {
    let result: boolean | UrlTree | undefined;
    (guard.canActivate() as Observable<boolean | UrlTree>).subscribe(
      (value: boolean | UrlTree) => (result = value)
    );
    if (result === undefined) {
      throw new Error('canActivate observable did not resolve synchronously');
    }
    return result;
  }

  it('should renew the session before loading the user', () => {
    // the answer carries the access token lifetime that arms the proactive renewal, so a session
    // left idle for hours never has to fall back on a 401
    expect(activate()).toBe(true);

    expect(sessionServiceSpy.resume).toHaveBeenCalledTimes(1);
    expect(userServiceSpy.loadCurrentInfo).toHaveBeenCalledTimes(1);
  });

  it('should load the user even when the renewal was skipped or failed', () => {
    // resume() concludes nothing: another tab may have won the rotation, and the access token in
    // the shared jar may be perfectly valid. Only the API says who is connected.
    sessionServiceSpy.resume.mockReturnValue(of(undefined));

    expect(activate()).toBe(true);
    expect(userServiceSpy.loadCurrentInfo).toHaveBeenCalledTimes(1);
  });

  it('should refuse the route when the user cannot be loaded', () => {
    userServiceSpy.loadCurrentInfo.mockReturnValue(throwError(() => ({ nestedError: null })));

    expect(activate()).toBe(false);
  });

  it('should send a user without space to the dedicated page', () => {
    userServiceSpy.loadCurrentInfo.mockReturnValue(
      throwError(() => ({ nestedError: { code: 'error.user_without_space' } }))
    );

    activate();

    expect(routerSpy.parseUrl).toHaveBeenCalled();
  });
});
