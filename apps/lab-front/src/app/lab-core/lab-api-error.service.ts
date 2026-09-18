import { PlatformLocation } from '@angular/common';
import { inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { FlCleanerService, FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { LI_CONST_LOGIN_ROUTE, LiApiErrorService, LiAuthService } from '@monorepo/lab-lib/li-core';

@Injectable()
export class LabApiErrorService extends LiApiErrorService {
  private router = inject(Router);
  private injector = inject(Injector);
  private platformLocation = inject(PlatformLocation);

  /**
   * Resolved lazily: LiAuthService depends on FlApiService, which depends on this error service.
   * Injecting it as a field would close that cycle.
   */
  private getAuthService(): LiAuthService {
    return this.injector.get(LiAuthService);
  }

  /**
   * Manage error when the token of the user is invalid,
   * Logout the user and redirect to login
   * @private
   */
  logoutUser(): void {
    // for security clear the session marker to assure the user is disconnected. Through the auth
    // service, which owns the cookie's attributes: a delete only drops a cookie when its name,
    // path and domain match the ones it was set with.
    this.getAuthService().clearSessionMarker();

    if (this.router.url.startsWith(LI_CONST_LOGIN_ROUTE)) return;

    FlCleanerService.getInstance().cleanServices();

    // save the current url for rerouting after login
    const currentRoute = this.platformLocation.pathname;

    // save the url if it's different
    if (currentRoute !== '/') {
      FlLoginSavedRoute.route = currentRoute;
    }
    // redirect the user to the login page, with autoRedirect param to avoid infinite loop
    this.router.navigate([LI_CONST_LOGIN_ROUTE], { queryParams: { autoRedirect: false } });
  }
}
