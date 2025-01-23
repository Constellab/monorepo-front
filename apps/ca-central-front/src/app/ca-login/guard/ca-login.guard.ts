import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { CaAuthService } from '../service/ca-auth.service';
import { Observable } from 'rxjs';
import { CaRouterService } from '../../ca-core/service/ca-router.service';

/**
 * Login page guard to redirect to app pages if a token exists
 */
@Injectable({
  providedIn: 'root',
})
export class CaLoginGuard {
  private loginService = inject(CaAuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // if the autoRedirect is set to false, don't try to redirect to avoid infinite loop
    if (route.queryParams.autoRedirect === 'false') return true;
    if (this.loginService.hasAuthorizationCookie()) {
      return this.router.createUrlTree([CaRouterService.getAppRoute()]);
    }
    return true;
  }
}
