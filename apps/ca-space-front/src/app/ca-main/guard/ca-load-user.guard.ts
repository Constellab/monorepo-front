import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { FlServerError } from '@monorepo/front-core-lib/fl-api';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CaRouterService } from '../../ca-core/service/ca-router.service';
import { CaAuthenticatedUserService } from '../../ca-core/service-api/ca-authenticated-user.service';
import { CaAuthSessionService } from '../../ca-login/service/ca-auth-session.service';

/**
 * Guard TO ONLY BE PLACED for the /app route
 *
 * It load and save the connected user
 */
@Injectable({
  providedIn: 'root',
})
export class CaLoadUserGuard {
  private authenticatedUserService = inject(CaAuthenticatedUserService);
  private sessionService = inject(CaAuthSessionService);
  private router = inject(Router);

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // renew the pair first: a page load knows neither whether it is logged in nor when its access
    // token dies, and the answer carries the lifetime that arms the proactive renewal. Without it
    // the tab would wait for its first 401 to learn anything. It concludes nothing on its own -
    // only the API says who is connected - so the load below runs whatever the outcome.
    return this.sessionService.resume().pipe(
      switchMap(() => this.authenticatedUserService.loadCurrentInfo()),
      map(() => true),
      catchError((error: FlServerError) => {
        // if the user is not in any space, redirect to the no-space page
        if (error.nestedError?.code === 'error.user_without_space') {
          return of(this.router.parseUrl(CaRouterService.getNoSpaceRoute()));
        }

        return of(false);
      }) // if there was an error in the request, return false
    );
  }
}
