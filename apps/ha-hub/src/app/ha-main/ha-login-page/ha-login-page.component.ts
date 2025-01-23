import { Component, inject, OnInit } from '@angular/core';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { Location } from '@angular/common';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ha-login-page',
  templateUrl: './ha-login-page.component.html',
  styleUrls: ['./ha-login-page.component.scss'],
  imports: [FlAuthModule, TranslatePipe],
})
export class HaLoginPageComponent implements OnInit {
  private location = inject(Location);
  private authenticatedUserService = inject(HaAuthenticatedUserService);
  private activatedRoute = inject(ActivatedRoute);
  private snackBarService = inject(FlSnackBarService);
  private router = inject(Router);

  spaceSignupRoute: string = HaConstellabHelper.getConstellabSignupUrl();
  redirectionRoute: string = FlLoginSavedRoute.getRoutePath();

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => this.checkRouteQueryParams(params));
  }

  // check if there are any query params 'error' or 'success'

  onLoginSuccess(): void {
    this.authenticatedUserService.init();
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
