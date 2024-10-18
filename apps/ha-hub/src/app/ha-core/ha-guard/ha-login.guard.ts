/**
 * Login page guard to redirect to app pages if a token exists
 */
import {Injectable} from '@angular/core';
import {Router, UrlTree} from '@angular/router';
import {HaAuthService} from '../ha-service/ha-auth.service';
import {Observable} from 'rxjs';
import {HaRouterService} from '../ha-service/ha-router.service';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib';
import { PlatformLocation } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class HaLoginGuard  {
  constructor(private loginService: HaAuthService, private router: Router, private platformLocation: PlatformLocation) {
  }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // save the current url for rerouting after login
    const currentRoute = this.platformLocation.pathname;

    // save the url if it's different
    if (
      currentRoute !== HaRouterService.getLoginRoute() &&
      currentRoute !== '/'
    ) {
      FlLoginSavedRoute.route = currentRoute;
    }

    if (!this.loginService.hasAuthorizationCookie()) {
      return this.router.createUrlTree([HaRouterService.getLoginRoute()]);
    }
    return true;
  }

}
