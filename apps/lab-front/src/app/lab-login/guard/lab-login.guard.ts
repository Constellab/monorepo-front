import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { LiAuthService, LiRouterService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

/**
 * Login page guard to redirect to app pages if a token exists
 */
@Injectable({
  providedIn: 'root',
})
export class LabLoginGuard {
  private authenticationService = inject(LiAuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (route.queryParams.autoRedirect === 'false') return true;
    if (this.authenticationService.hasAuthorizationCookie()) {
      return this.router.createUrlTree([LiRouterService.getAppRoute()]);
    }
    return true;
  }
}
