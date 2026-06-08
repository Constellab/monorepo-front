import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CaRouterService } from '../service/ca-router.service';
import { CaAuthenticatedUserService } from '../service-api/ca-authenticated-user.service';

/**
 * Guard to secure route to only give access to space admin (or g admin)
 */
@Injectable({
  providedIn: 'root',
})
export class CaSpaceAdminGuard {
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticatedUserService.isCurrentSpaceAdmin()) {
      return true;
    } else {
      return this.router.parseUrl(CaRouterService.getAppRoute());
    }
  }
}
