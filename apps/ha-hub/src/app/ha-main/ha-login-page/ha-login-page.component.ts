import { Component, OnInit } from '@angular/core';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
import { Location } from '@angular/common';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlLoginSavedRoute, FlSnackBarService } from '@monorepo/front-core-lib';

@Component({
    selector: 'ha-login-page',
    templateUrl: './ha-login-page.component.html',
    styleUrls: ['./ha-login-page.component.scss'],
    standalone: false
})
export class HaLoginPageComponent implements OnInit {
  spaceSignupRoute: string = HaConstellabHelper.getConstellabSignupUrl();
  redirectionRoute: string = FlLoginSavedRoute.getRoutePath();

  constructor(
    private location: Location,
    private authenticatedUserService: HaAuthenticatedUserService,
    private activatedRoute: ActivatedRoute,
    private snackBarService: FlSnackBarService,
    private router: Router
  ) {}

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
