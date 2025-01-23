import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { LabResourceView } from '../../lab-core/model/entities/resource/lab-resource-view.entity';
import { LabShareService } from '../../lab-core/entity-service/lab-share.service';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';

import { RvResourceViewModule, RvResourceViewModuleConfig, RvViewConfig } from '@monorepo/resource-view';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { map } from 'rxjs/operators';
import { LabOpenRouteResourceViewModuleConfig } from '../model/lab-open-route-view.config';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { LabEnvironmentHelper } from '../../lab-core/utils/lab-environment.helper';

@Component({
  selector: 'lab-open-route-resource-page',
  imports: [
    FlSectionModule,
    RvResourceViewModule,
    TdTechnicalDocModule,
    AsyncPipe,
    NgOptimizedImage,
    FlCoreDirectiveModule,
    FlTranslateModule,
  ],
  templateUrl: './lab-open-route-resource-page.component.html',
  styleUrl: './lab-open-route-resource-page.component.scss',
})
export class LabOpenRouteResourcePageComponent {
  private activatedRoute = inject(ActivatedRoute);

  private labShareService = inject(LabShareService);
  private themeService = inject(FlThemeService);

  viewModuleConfig$: Observable<RvResourceViewModuleConfig> = this.activatedRoute.params.pipe(
    map((params) => new LabOpenRouteResourceViewModuleConfig(this.labShareService, params['token']))
  );

  resourceView$: Observable<LabResourceView> = this.activatedRoute.params.pipe(
    switchMap((params) => this.labShareService.callDefaultViewOnResource(params['token']))
  );

  logo = this.themeService.getConstellabLogo();

  constellabUrl = LabEnvironmentHelper.getConstellabPublicUrl();

  getViewConfig(view: LabResourceView): RvViewConfig {
    return {
      methodName: view.viewConfig.viewName,
      configValues: view.viewConfig.configValues,
    };
  }
}
