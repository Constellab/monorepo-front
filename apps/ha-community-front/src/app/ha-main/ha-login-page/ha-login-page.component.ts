import { isPlatformBrowser, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaOauthHelper } from '../../ha-core/ha-model/ha-config/ha-oauth.helper';
import { HaAuthService } from '../../ha-core/ha-service/ha-auth.service';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { HaRefreshCoordinatorService } from '../../ha-core/ha-service/ha-refresh-coordinator.service';
import { HaRouterService } from '../../ha-core/ha-service/ha-router.service';
import { HaHomeSectionShineComponent } from '../../ha-home/ha-home-section-shine/ha-home-section-shine.component';

@Component({
  selector: 'ha-login-page',
  templateUrl: './ha-login-page.component.html',
  styleUrls: ['./ha-login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlAuthModule,
    HaFooterComponent,
    HaHeaderComponent,
    HaHomeSectionShineComponent,
    TranslatePipe,
    MatButton,
  ],
})
export class HaLoginPageComponent implements OnInit {
  private location = inject(Location);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private authService = inject(HaAuthService);
  private refreshCoordinator = inject(HaRefreshCoordinatorService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarService = inject(FlSnackBarService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  spaceSignupRoute: string = HaConstellabHelper.getConstellabSignupUrl();
  redirectionRoute: string | null = FlLoginSavedRoute.getRoutePath();

  /**
   * Url of the API /oauth/authorize endpoint to come back to after login, when the login page was
   * opened by the OAuth flow of an MCP client. Null in the normal login case.
   */
  private oauthReturnUrl: string | null = null;

  ngOnInit(): void {
    this.oauthReturnUrl = HaOauthHelper.getSafeAuthorizeReturnUrl(
      this.activatedRoute.snapshot.queryParams[HaOauthHelper.RETURN_URL_QUERY_PARAM]
    );
    if (this.oauthReturnUrl) {
      // the redirection leaves the app, don't let fl-complete-login navigate inside the app first
      this.redirectionRoute = null;
      this.resumeOauthFlow();
    } else {
      this.authenticatedUserService.isAuthenticatedOnce().subscribe((authenticated) => {
        if (authenticated) {
          this.router.navigate([HaRouterService.getHomeRoute()]);
        }
      });
    }

    this.activatedRoute.queryParams.subscribe((params) => this.checkRouteQueryParams(params));
  }

  onLoginSuccess(): void {
    this.authenticatedUserService.init();

    if (this.oauthReturnUrl) {
      this.redirectToOauthAuthorize();
      return;
    }

    this.redirect();
  }

  /**
   * Come back to /oauth/authorize for a visitor who may already have a session.
   *
   * The refresh is what makes the answer authoritative, and it is attempted unconditionally: the
   * API is the only thing that knows. Redirecting on the word of a cookie with an expired access
   * token makes the API bounce the user back to /login?returnUrl=..., looping between the front
   * and the API. A failed refresh means no session: fall through and show the form.
   *
   * Routed through the coordinator like every other refresh: an MCP client opens this page in a new
   * tab while the app is very likely already open in another, which is exactly the collision the
   * API punishes by destroying the session. A skipped refresh answers the question just as well -
   * another tab renewed the pair a moment ago, so the session is alive.
   */
  private resumeOauthFlow(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.refreshCoordinator
      .coordinate(() => this.authService.refresh())
      .subscribe({
        next: () => this.redirectToOauthAuthorize(),
        // no session: stay on the page and let the visitor log in
        error: () => undefined,
      });
  }

  /**
   * Resume the OAuth flow of the MCP client. This must be a full browser navigation and not a
   * router navigation: the target is the API origin, not an app route.
   */
  private redirectToOauthAuthorize(): void {
    if (!isPlatformBrowser(this.platformId) || this.oauthReturnUrl == null) {
      return;
    }
    window.location.assign(this.oauthReturnUrl);
  }

  private redirect(): void {
    if (this.redirectionRoute) {
      this.router.navigate([this.redirectionRoute]);
    } else {
      this.location.back();
    }
  }

  // used for signup, account unlock
  private checkRouteQueryParams(params: Params): void {
    // use a timeout to let the translation load
    setTimeout(() => {
      if (params.error) {
        this.snackBarService.openErrorMessage({
          text: params.error,
          translateText: true,
        });
      } else if (params.success) {
        this.snackBarService.openSuccessMessage({
          text: params.success,
          translateText: true,
        });
      }
    }, 300);
  }
}
