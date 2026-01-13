import { AsyncPipe } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { LiResourceView, LiShareLinkPublicAuth, LiShareService } from '@monorepo/lab-lib/li-core';
import { RvResourceViewModule, RvViewConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { combineLatest, map, Observable } from 'rxjs';

import { LabHttpInterceptorService } from '../../lab-core/lab-http-interceptor';
import { LabOpenRouteResourceViewModuleConfig } from '../model/lab-public-route-view.config';

@Component({
  selector: 'lab-public-route-resource-page',
  imports: [
    FlSectionModule,
    RvResourceViewModule,
    TdTechnicalDocModule,
    AsyncPipe,
    FlCoreDirectiveModule,
    FlTranslateModule,
    FlCoreComponentModule,
  ],
  templateUrl: './lab-public-route-resource-page.component.html',
  styleUrl: './lab-public-route-resource-page.component.scss',
})
export class LabPublicRouteResourcePageComponent implements OnInit, OnDestroy {
  private activatedRoute = inject(ActivatedRoute);

  private labShareService = inject(LiShareService);
  private themeService = inject(FlThemeService);
  private labPublicInterceptor = inject(LabHttpInterceptorService);

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

  ngOnInit(): void {
    this.authInfo$.subscribe((auth) => {
      this.labPublicInterceptor.setLinkPublicAuth(auth);
    });
  }

  viewModuleConfig = new LabOpenRouteResourceViewModuleConfig(this.labShareService);

  resourceView$: Observable<LiResourceView> = this.labShareService.callDefaultViewOnResource();

  hideHeader$: Observable<boolean> = this.activatedRoute.queryParams.pipe(
    map((queryParams) => queryParams['hide_header'] === 'true')
  );

  logo = this.themeService.getConstellabLogo();

  getViewConfig(view: LiResourceView): RvViewConfig {
    if (view.viewConfig == null) return null;
    return {
      methodName: view.viewConfig.viewName,
      configValues: view.viewConfig.configValues,
    };
  }

  ngOnDestroy(): void {
    this.labPublicInterceptor.clearLinkPublicAuth();
  }
}
