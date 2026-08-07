import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
      map((live: boolean) => (live ? this.router.createUrlTree([CaRouterService.getAppRoute()]) : true))
    );
  }
}
