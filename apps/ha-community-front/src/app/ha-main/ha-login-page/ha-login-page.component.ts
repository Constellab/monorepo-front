import { Location } from '@angular/common';
import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FlAuthModule } from '@monorepo/front-core-lib/fl-auth';
import { FlLoginSavedRoute } from '@monorepo/front-core-lib/fl-core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';

import { HaFooterComponent } from '../../ha-core/ha-component/ha-footer/ha-footer/ha-footer.component';
import { HaHeaderComponent } from '../../ha-core/ha-component/ha-header/ha-header/ha-header.component';
import { HaConstellabHelper } from '../../ha-core/ha-model/ha-config/ha-constellab.helper';
import { HaAuthenticatedUserService } from '../../ha-core/ha-service/ha-authenticated-user.service';
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
  private activatedRoute = inject(ActivatedRoute);
  private snackBarService = inject(FlSnackBarService);
  private router = inject(Router);

  spaceSignupRoute: string = HaConstellabHelper.getConstellabSignupUrl();
  redirectionRoute: string = FlLoginSavedRoute.getRoutePath();

  ngOnInit(): void {
    if (this.authenticatedUserService.hasAuthorizationCookie()) {
      this.router.navigate([HaRouterService.getHomeRoute()]);
    }

    this.activatedRoute.queryParams.subscribe((params) => this.checkRouteQueryParams(params));
  }

  // check if there are any query params 'error' or 'success'

  onLoginSuccess(): void {
    this.authenticatedUserService.init();
    this.redirect();
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
