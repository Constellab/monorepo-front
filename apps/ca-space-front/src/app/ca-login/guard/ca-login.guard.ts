import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CaOauthReturnUrlService } from '../../ca-core/service/ca-oauth-return-url.service';
import { CaRouterService } from '../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../ca-core/service-api/ca-authenticated-user.service';
import { CaAuthService } from '../service/ca-auth.service';
import { CaAuthSessionService } from '../service/ca-auth-session.service';

/**
 * Login page guard to redirect to app pages if a session exists
 */
@Injectable({
  providedIn: 'root',
})
export class CaLoginGuard {
  private loginService = inject(CaAuthService);
  private sessionService = inject(CaAuthSessionService);
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private returnUrlService = inject(CaOauthReturnUrlService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if the autoRedirect is set to false, don't try to redirect to avoid infinite loop
    if (route.queryParams.autoRedirect === 'false') return true;

    // no marker means certainly no session: the only question a cookie is ever allowed to answer,
    // and the one that spares an API call for everyone arriving at the login page to log in
    if (!this.loginService.hasAuthorizationCookie()) return true;

    // a marker only says "maybe". It now outlives the session on purpose, so one left behind by a
    // session that ended weeks ago would send its owner into the app just to be thrown back here
    // with a "session expired" they never caused. Ask the API instead, and renew first so an
    // expired access token does not read as a dead session.
    return this.sessionService.resume().pipe(
      switchMap(() => this.authenticatedUserService.hasLiveSession()),
      map((live: boolean) => (live ? this.destinationOfLiveSession(route) : true))
    );
  }

  /**
   * Where a visitor who turns out to be logged in belongs.
   *
   * Normally the app. But the authorization server sends a machine client's user here whenever GET
   * /oauth/authorize finds no valid session, and "no valid session" also covers an access token that
   * had merely expired while the session itself is alive - which the renewal above just fixed.
   * Entering the app there would abandon the flow with the client waiting for a redirect that never
   * comes, so come back to the endpoint instead and let it resume.
   *
   * @returns false in that case: the browser is leaving the app, so the router must not route.
   */
  private destinationOfLiveSession(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const returnUrl: string | null = this.returnUrlService.getSafeAuthorizeReturnUrl(route.queryParams);
    if (returnUrl) {
      this.returnUrlService.resume(returnUrl);
      return false;
    }

    return this.router.createUrlTree([CaRouterService.getAppRoute()]);
  }
}
