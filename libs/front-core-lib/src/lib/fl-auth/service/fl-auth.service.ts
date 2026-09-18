import { ClCredentials, ClCredentials2Fa } from '@monorepo/core-lib';
import { FL_AUTH_EXPIRED_COOKIE, FlCookieOptions } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';

export type FlAuthLoginResponse =
  | { status: 'LOGGED_IN'; expiresIn: number; twoFAUrlCode?: string }
  | { status: '2FA_REQUIRED'; expiresIn?: number; twoFAUrlCode?: string };

export interface FlAuthLogin2FaResponse {
  status: 'LOGGED_IN';
  expiresIn: number;
}

/**
 * Service to enable login and logout method
 */
export abstract class FlAuthService {
  protected constructor(private cookieService: FlCookieService) {}

  /**
   * Log in to API
   * The JWT is returned in a HTTPOnly cookie and is not accessible from JS
   * @param credentials username and password
   */
  public abstract login(credentials: ClCredentials): Observable<FlAuthLoginResponse>;

  /**
   * Methode to validate the 2FA code after the login if 2FA is required
   * @param credentials
   */
  public abstract checkTwoFA(credentials: ClCredentials2Fa): Observable<FlAuthLogin2FaResponse>;

  public abstract afterLogin(expiresIn: number): void;

  /**
   * Call the API to disconnect the user and remove his
   * JWT from the cookies
   */
  public abstract logout(): Observable<any>;

  /**
   * The name of the session marker cookie, for this app.
   *
   * Overridable because several apps of the platform can be served from the same domain tree. A
   * marker written with a 'Domain' attribute reaches every sibling sub-domain, so a second app
   * sharing the name either reads it as its own answer or shadows it with a same-named cookie of
   * its own - and `document.cookie` then hands out both, with nothing to tell them apart. A name
   * per app is what keeps two apps from answering each other's question.
   */
  protected getSessionMarkerName(): string {
    return FL_AUTH_EXPIRED_COOKIE;
  }

  /**
   * The cookie attributes of the session marker, for this app.
   *
   * One definition, used by every write and every delete, and that is the point: a browser only
   * drops a cookie when the name, the path and the domain of the delete match the ones it was set
   * with. A call site that rebuilds them by hand works until the two drift apart, and then leaves
   * the marker standing - a marker that survives the logout meant to clear it is the one failure
   * it must never have.
   *
   * 'domain' is deliberately absent: without it the cookie is host-only, the only scope that
   * cannot reach a sibling sub-domain. An app served from several sub-domains overrides this to
   * widen it, and then owns that choice for every other app under the same domain.
   */
  protected getSessionMarkerOptions(): FlCookieOptions {
    return { path: '/', secure: false, sameSite: 'Strict' };
  }

  protected storeAuthExpirationCookie(expiresIn: number): void {
    // get the date in expiresIn milliseconds
    const date = new Date(new Date().getTime() + expiresIn);
    // clear the millisecond to get closer to real expiration
    date.setMilliseconds(0);
    this.cookieService.setCookie(this.getSessionMarkerName(), date.getTime(), {
      ...this.getSessionMarkerOptions(),
      expires: date,
    });
  }

  /**
   * Drop the session marker. Public because the api error pipeline clears it too, when a 401 has
   * proved the session is over.
   *
   * An app that widened the scope also gets the host-only cookie deleted: both can exist at once
   * under the same name - left by an earlier release, or written by another app of the platform on
   * this very host - and clearing only the scoped one leaves the other answering "maybe a session"
   * until it expires on its own.
   */
  public clearSessionMarker(): void {
    const options: FlCookieOptions = this.getSessionMarkerOptions();
    const name: string = this.getSessionMarkerName();

    this.cookieService.removeCookie(name, options);

    // an empty domain is what a front domain that is not configured looks like, locally: the
    // cookie was written host-only, the delete above already matched it
    if (options.domain) {
      this.cookieService.removeCookie(name, { ...options, domain: undefined });
    }
  }

  /**
   * Return true if the session marker of this app exists
   */
  public hasAuthorizationCookie(): boolean {
    return this.cookieService.check(this.getSessionMarkerName());
  }
}
