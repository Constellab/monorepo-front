import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { LabResourceView } from '../../lab-core/model/entities/resource/lab-resource-view.entity';
import { LabShareService } from '../../lab-core/entity-service/lab-share.service';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { RvResourceViewModule, RvResourceViewModuleConfig, RvViewConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { LabOpenRouteResourceViewModuleConfig } from '../model/lab-public-route-view.config';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { LabEnvironmentHelper } from '../../lab-core/utils/lab-environment.helper';
import { LabShareLinkPublicAuth } from '../../lab-core/model/entities/lab-share.entity';

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

  private labShareService = inject(LabShareService);
  private themeService = inject(FlThemeService);

  /**
   * Retrieve the authentication info from the URL
   * @private
   */
  private authInfo$: Observable<LabShareLinkPublicAuth> = combineLatest([
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

  resourceView$: Observable<LabResourceView> = this.authInfo$.pipe(
    switchMap((auth) => this.labShareService.callDefaultViewOnResource(auth))
  );

  hideHeader$: Observable<boolean> = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['hide_header'] === 'true')
  );

  logo = this.themeService.getConstellabLogo();

  constellabUrl = LabEnvironmentHelper.getConstellabPublicUrl();

  getViewConfig(view: LabResourceView): RvViewConfig {
    if (view.viewConfig == null) return null;
    return {
      methodName: view.viewConfig.viewName,
      configValues: view.viewConfig.configValues,
    };
  }
}
