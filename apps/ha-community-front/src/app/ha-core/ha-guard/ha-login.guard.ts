/**
 * Login page guard to redirect to app pages if a token exists
 */
import { isPlatformServer, PlatformLocation } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../ha-service/ha-router.service';

@Injectable({
  providedIn: 'root',
})
export class HaLoginGuard {
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private router = inject(Router);
  private platformLocation = inject(PlatformLocation);
  private platformId = inject(PLATFORM_ID);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // save the current url for rerouting after login
    const currentRoute = this.platformLocation.pathname;

    // save the url if it's different
    if (currentRoute !== HaRouterService.getLoginRoute() && currentRoute !== '/') {
      FlLoginSavedRoute.route = currentRoute;
    }

    // the server must answer without waiting and cannot renew an expired access token, so the
    // marker cookie is the only signal it has. The browser asks the API instead.
    if (isPlatformServer(this.platformId)) {
      return this.authenticatedUserService.hasSessionMarkerOnServer() || this.loginPage();
    }

    return this.authenticatedUserService
      .isAuthenticatedOnce()
      .pipe(map((authenticated) => authenticated || this.loginPage()));
  }

  private loginPage(): UrlTree {
    return this.router.createUrlTree([HaRouterService.getLoginRoute()]);
  }
}
