import { FL_AUTH_EXPIRED_COOKIE, FlCookieOptions } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable, of } from 'rxjs';

import { FlAuthLogin2FaResponse, FlAuthLoginResponse, FlAuthService } from './fl-auth.service';

/**
 * The session marker contract shared by every app of the platform.
 *
 * It matters here rather than only in the subclasses because the apps can be served from the same
 * domain tree: a marker scoped to a domain reaches every one of its sub-domains, where another app
 * reads it as its own answer or shadows it with a cookie of the same name. The name and the scope
 * are therefore one definition per app, and the delete is built from that same definition - the
 * browser only drops a cookie whose name, path and domain match the ones it was set with.
 */
describe('FlAuthService session marker', () => {
  const ONE_HOUR = 3600000;

  let cookieServiceSpy: {
    setCookie: ReturnType<typeof vi.fn>;
    removeCookie: ReturnType<typeof vi.fn>;
    check: ReturnType<typeof vi.fn>;
  };

  /** the smallest concrete subclass: only the marker is under test */
  class TestAuthService extends FlAuthService {
    constructor(
      cookieService: FlCookieService,
      private readonly name?: string,
      private readonly options?: FlCookieOptions
    ) {
      super(cookieService);
    }

    protected override getSessionMarkerName(): string {
      return this.name ?? super.getSessionMarkerName();
    }

    protected override getSessionMarkerOptions(): FlCookieOptions {
      return this.options ?? super.getSessionMarkerOptions();
    }

    public store(expiresIn: number): void {
      this.storeAuthExpirationCookie(expiresIn);
    }

    public login(): Observable<FlAuthLoginResponse> {
      return of({ status: 'LOGGED_IN', expiresIn: ONE_HOUR });
    }

    public checkTwoFA(): Observable<FlAuthLogin2FaResponse> {
      return of({ status: 'LOGGED_IN', expiresIn: ONE_HOUR });
    }

    public afterLogin(): void {
      // nothing to schedule here
    }

    public logout(): Observable<void> {
      return of(undefined);
    }
  }

  function build(name?: string, options?: FlCookieOptions): TestAuthService {
    return new TestAuthService(cookieServiceSpy as unknown as FlCookieService, name, options);
  }

  beforeEach(() => {
    cookieServiceSpy = {
      setCookie: vi.fn(),
      removeCookie: vi.fn(),
      check: vi.fn().mockReturnValue(false),
    };
  });

  it('should write the marker host-only by default', () => {
    // the only scope that cannot reach a sibling sub-domain. Widening it is a decision an app
    // takes explicitly, never one it inherits.
    build().store(ONE_HOUR);

    const options = cookieServiceSpy.setCookie.mock.calls[0][2];
    expect(options.domain).toBeUndefined();
    expect(options.path).toBe('/');
  });

  it('should write the marker under the name the app chose', () => {
    build('Auth_Expiration_Test').store(ONE_HOUR);

    expect(cookieServiceSpy.setCookie).toHaveBeenCalledWith(
      'Auth_Expiration_Test',
      expect.anything(),
      expect.anything()
    );
  });

  it('should read the presence of that same name', () => {
    build('Auth_Expiration_Test').hasAuthorizationCookie();

    expect(cookieServiceSpy.check).toHaveBeenCalledWith('Auth_Expiration_Test');
  });

  it('should delete the marker with the attributes it was written with', () => {
    const service = build(undefined, { path: '/', secure: false, sameSite: 'Lax', domain: 'test.local' });

    service.store(ONE_HOUR);
    const written = cookieServiceSpy.setCookie.mock.calls[0][2];
    service.clearSessionMarker();

    expect(cookieServiceSpy.removeCookie).toHaveBeenCalledWith(
      FL_AUTH_EXPIRED_COOKIE,
      expect.objectContaining({
        path: written.path,
        domain: written.domain,
        sameSite: written.sameSite,
      })
    );
  });

  it('should also delete a host-only copy when the scope was widened', () => {
    // two cookies of that name can sit in the jar at once - one scoped to the parent domain, one
    // host-only from another app of the platform or an earlier release - and `document.cookie`
    // hands out both with nothing to tell them apart. Leaving one behind keeps it answering
    // "maybe a session" until it expires on its own.
    build(undefined, { path: '/', sameSite: 'Strict', domain: 'test.local' }).clearSessionMarker();

    expect(cookieServiceSpy.removeCookie).toHaveBeenCalledWith(
      FL_AUTH_EXPIRED_COOKIE,
      expect.objectContaining({ domain: undefined })
    );
  });

  it('should delete a host-only marker once', () => {
    // nothing was widened, so there is no second copy to chase
    build().clearSessionMarker();

    expect(cookieServiceSpy.removeCookie).toHaveBeenCalledTimes(1);
  });

  it('should expire the marker at the announced lifetime', () => {
    const before = Date.now();

    build().store(ONE_HOUR);

    const options = cookieServiceSpy.setCookie.mock.calls[0][2];
    expect(options.expires.getTime()).toBeGreaterThanOrEqual(before + ONE_HOUR - 1000);
    // the milliseconds are cleared to stay closer to the real expiration
    expect(options.expires.getMilliseconds()).toBe(0);
  });
});
