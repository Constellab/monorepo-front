import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { LiAuthService, LiRouterService } from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';

/**
 * Guard to get the token from the query param named 'token', store it locally
 *
 * Then it redirects the user to the app
 */
@Injectable({
  providedIn: 'root',
})
export class LabAutoLoginGuard {
  private router = inject(Router);
  private authenticateService = inject(LiAuthService);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let expiresIn: number;
    try {
      expiresIn = parseInt(route.queryParams['expiresIn']);
    } catch (e) {
      expiresIn = null;
    }

    if (expiresIn) {
      // store the token in the
      this.authenticateService.afterLogin(expiresIn);
      return this.router.parseUrl(LiRouterService.getLoginRoute());
    } else {
      return this.router.parseUrl(LiRouterService.getLoginRoute());
    }
  }
}
