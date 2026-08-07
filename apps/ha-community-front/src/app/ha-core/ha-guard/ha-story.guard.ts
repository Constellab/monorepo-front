import { isPlatformServer, PlatformLocation } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { catchError, mergeMap, Observable, of } from 'rxjs';

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

  private canEditStory(storyId: string): Observable<boolean | UrlTree> {
    return this.authUserService.isAdmin().pipe(
      mergeMap((isAdmin) => (isAdmin ? of(true) : this.storyService.isStoryOwnerOrCoAuthor(storyId))),
      catchError((error: FlServerError) => of(this.unansweredCheck(error)))
    );
  }

  /**
   * The check could not be answered at all. Without this the observable would simply error and take
   * the whole render down with it.
   *
   * A 401 means the request could not be authenticated, which says nothing about the rights of the
   * visitor: during SSR the forwarded access token is expired and the server cannot renew it, so
   * this is the normal answer for a user whose session is perfectly valid. Concluding "not allowed"
   * would send them to the login page - the one thing a marker must never do. Let the route
   * through: the browser runs this guard again after hydration, where the answer is authoritative,
   * and the API still gates the story itself, so the server only renders an empty shell.
   *
   * Any other failure is a real problem rather than a missing credential, and the login page is the
   * safer place to land.
   */
  private unansweredCheck(error: FlServerError): boolean | UrlTree {
    return error?.response?.status === 401 ? true : this.loginPage();
  }

  private loginPage(): UrlTree {
    return this.router.createUrlTree([HaRouterService.getLoginRoute()]);
  }
}
