import { PlatformLocation } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { mergeMap, Observable } from 'rxjs';

import { HaAuthService } from '../ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from '../ha-service/ha-authenticated-user.service';
import { HaRouterService } from '../ha-service/ha-router.service';
import { HaStoryService } from '../ha-service/ha-story.service';

@Injectable({
  providedIn: 'root',
})
export class HaStoryGuard {
  private storyService = inject(HaStoryService);
  private authUserService = inject(HaAuthenticatedUserService);
  private platformLocation = inject(PlatformLocation);
  private loginService = inject(HaAuthService);
  private router = inject(Router);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // save the current url for rerouting after login
    const currentRoute = this.platformLocation.pathname;

    // save the url if it's different
    if (currentRoute !== HaRouterService.getLoginRoute() && currentRoute !== '/') {
      FlLoginSavedRoute.route = currentRoute;
    }

    if (!this.loginService.hasAuthorizationCookie()) {
      return this.router.createUrlTree([HaRouterService.getLoginRoute()]);
    }

    const storyId = route.paramMap.get('id');
    return this.authUserService.isAdmin().pipe(
      mergeMap((isAdmin) => {
        if (isAdmin) {
          return new Observable<boolean>((observer) => observer.next(true));
        } else {
          return this.storyService.isStoryOwnerOrCoAuthor(storyId);
        }
      })
    );
  }
}
