import { isPlatformServer, PlatformLocation } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { mergeMap, Observable, of } from 'rxjs';

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
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // save the current url for rerouting after login
    const currentRoute = this.platformLocation.pathname;

    // save the url if it's different
    if (currentRoute !== HaRouterService.getLoginRoute() && currentRoute !== '/') {
      FlLoginSavedRoute.route = currentRoute;
    }

    const storyId = route.paramMap.get('id');

    // the server must answer without waiting and cannot renew an expired access token, so the
    // marker cookie is the only signal it has. The browser asks the API instead.
    if (isPlatformServer(this.platformId)) {
      return this.authUserService.hasSessionMarkerOnServer() ? this.canEditStory(storyId) : this.loginPage();
    }

    return this.authUserService
      .isAuthenticatedOnce()
      .pipe(mergeMap((authenticated) => (authenticated ? this.canEditStory(storyId) : of(this.loginPage()))));
  }

  private canEditStory(storyId: string): Observable<boolean> {
    return this.authUserService
      .isAdmin()
      .pipe(mergeMap((isAdmin) => (isAdmin ? of(true) : this.storyService.isStoryOwnerOrCoAuthor(storyId))));
  }

  private loginPage(): UrlTree {
    return this.router.createUrlTree([HaRouterService.getLoginRoute()]);
  }
}
