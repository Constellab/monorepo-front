import { PlatformLocation } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { flAuthExpiredCookie, FlCleanerService, FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { FlCookieService } from '@monorepo/front-core-lib/fl-dialog';
import { LiApiErrorService, liConstLoginRoute } from '@monorepo/lab-lib/li-core';

@Injectable()
export class LabApiErrorService extends LiApiErrorService {
  private router = inject(Router);
  private cookieService = inject(FlCookieService);
  private platformLocation = inject(PlatformLocation);

  /**
   * Manage error when the token of the user is invalid,
   * Logout the user and redirect to login
   * @private
   */
  logoutUser(): void {
    // for security clear the authentication expiration cookie
    // to assure the user is disconnected
    this.cookieService.removeCookie(flAuthExpiredCookie);

    if (this.router.url.startsWith(liConstLoginRoute)) return;

    FlCleanerService.getInstance().cleanServices();

    // save the current url for rerouting after login
    const currentRoute = this.platformLocation.pathname;

    // save the url if it's different
    if (currentRoute !== '/') {
      FlLoginSavedRoute.route = currentRoute;
    }
    // redirect the user to the login page, with autoRedirect param to avoid infinite loop
    this.router.navigate([liConstLoginRoute], { queryParams: { autoRedirect: false } });
  }
}
