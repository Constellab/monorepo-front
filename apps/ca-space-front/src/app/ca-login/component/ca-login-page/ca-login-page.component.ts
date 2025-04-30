import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlAuthModule, FlPasswordForgottenComponent } from '@monorepo/front-core-lib/fl-auth';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-login-page',
  templateUrl: './ca-login-page.component.html',
  styleUrls: ['./ca-login-page.component.scss'],
  imports: [FlAuthModule, RouterLink, TranslatePipe],
})
export class CaLoginPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private snackBarService = inject(FlSnackBarService);
  private dialogService = inject(FlDialogService);

  appRoute: string = CaRouterService.getAppRoute();

  signupRoute: string = CaRouterService.getSignupRoute();

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => this.checkRouteQueryParams(params));
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
