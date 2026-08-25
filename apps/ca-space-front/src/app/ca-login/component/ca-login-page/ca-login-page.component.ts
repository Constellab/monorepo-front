import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FlAuthModule, FlPasswordForgottenComponent } from '@monorepo/front-core-lib/fl-auth';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { CaOauthReturnUrlService } from '../../../ca-core/service/ca-oauth-return-url.service';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';

@Component({
  selector: 'ca-login-page',
  templateUrl: './ca-login-page.component.html',
  styleUrls: ['./ca-login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlAuthModule, RouterLink, TranslatePipe],
})
export class CaLoginPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);
  private returnUrlService = inject(CaOauthReturnUrlService);

  signupRoute: string = CaRouterService.getSignupRoute();

  /**
   * Url of the API authorization endpoint to come back to after login, when the login page was
   * opened by the OAuth flow of a machine client. Null in the normal login case.
   */
  private authorizeReturnUrl: WritableSignal<string | null> = signal(null);

  /**
   * Route fl-complete-login navigates to once the login is through. Null when the redirection leaves
   * the app entirely: an in-app navigation would tear this page down mid-redirection, and a route
   * saved by an expired session would win over the flow the visitor came here to complete.
   *
   * Derived rather than stored, so the two can never disagree about where the visitor is going.
   */
  redirectionRoute: Signal<string | null> = computed(() =>
    this.authorizeReturnUrl() ? null : CaRouterService.getAppRoute()
  );

  ngOnInit(): void {
    this.authorizeReturnUrl.set(
      this.returnUrlService.getSafeAuthorizeReturnUrl(this.route.snapshot.queryParams)
    );

    this.route.queryParams.subscribe((params) => this.checkRouteQueryParams(params));
  }

  /**
   * Called for a password login and for a completed two factor step alike: fl-complete-login funnels
   * both through it, so the flow resumes whichever way the visitor got in.
   */
  onLoginSuccess(): void {
    const returnUrl: string | null = this.authorizeReturnUrl();
    if (returnUrl) {
      this.returnUrlService.resume(returnUrl);
    }
  }

  // check if there are any query params 'error' or 'success'
  // used for signup, account unlock
  private checkRouteQueryParams(params: Params): void {
    // use a timeout to let the translation load
    setTimeout(() => {
      if (params.error) {
        this.snackBarService.openErrorMessage({ text: params.error, translateText: true });
      } else if (params.success) {
        this.snackBarService.openSuccessMessage({ text: params.success, translateText: true });
      }
    }, 300);
  }

  openPasswordForgotten(): void {
    this.dialogService.openSmallDialog(FlPasswordForgottenComponent);
  }
}
