import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiResourceView, LiShareLinkPublicAuth, LiShareService } from '@monorepo/lab-lib/li-core';
import { RvResourceViewModule, RvResourceViewModuleConfig, RvViewConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { LabEnvironmentHelper } from '../../lab-core/lab-environment.helper';
import { LabOpenRouteResourceViewModuleConfig } from '../model/lab-public-route-view.config';

@Component({
  selector: 'lab-public-route-resource-page',
  imports: [
    FlSectionModule,
    RvResourceViewModule,
    TdTechnicalDocModule,
    AsyncPipe,
    NgOptimizedImage,
    FlCoreDirectiveModule,
    FlTranslateModule,
  ],
  templateUrl: './lab-public-route-resource-page.component.html',
  styleUrl: './lab-public-route-resource-page.component.scss',
})
export class LabPublicRouteResourcePageComponent {
  private activatedRoute = inject(ActivatedRoute);

  private labShareService = inject(LiShareService);
  private themeService = inject(FlThemeService);

  /**
   * Retrieve the authentication info from the URL
   * @private
   */
  private authInfo$: Observable<LiShareLinkPublicAuth> = combineLatest([
    this.activatedRoute.params,
    this.activatedRoute.queryParams,
  ]).pipe(
    map(([params, queryParams]) => {
      return {
        token: params['token'],
        userAccessToken: queryParams['gws_user_access_token'],
      };
    })
  );

  viewModuleConfig$: Observable<RvResourceViewModuleConfig> = this.authInfo$.pipe(
    map((auth) => new LabOpenRouteResourceViewModuleConfig(this.labShareService, auth))
  );

  resourceView$: Observable<LiResourceView> = this.authInfo$.pipe(
    switchMap((auth) => this.labShareService.callDefaultViewOnResource(auth))
  );

  hideHeader$: Observable<boolean> = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['hide_header'] === 'true')
  );

  logo = this.themeService.getConstellabLogo();

  constellabUrl = LabEnvironmentHelper.getConstellabPublicUrl();

  getViewConfig(view: LiResourceView): RvViewConfig {
    if (view.viewConfig == null) return null;
    return {
      methodName: view.viewConfig.viewName,
      configValues: view.viewConfig.configValues,
    };
  }
}
