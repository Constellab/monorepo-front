import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { CaRouterService } from '../service/ca-router.service';
import { CaAuthenticatedUserService } from '../service-api/ca-authenticated-user.service';

/**
 * Guard to secure route to only give access to space user or admin (not viewer)
 */
@Injectable({
  providedIn: 'root',
})
export class CaSpaceUserGuard {
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authenticatedUserService.isCurrentSpaceUser()) {
      return true;
    } else {
      return this.router.parseUrl(CaRouterService.getAppRoute());
    }
  }
}
