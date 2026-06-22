import { CommonModule } from '@angular/common';
import { inject, ModuleWithProviders, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlPortalModule } from '../fl-portal/fl-portal.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlPortalActionLineComponent } from './component/fl-portal-action-line/fl-portal-action-line.component';
import { FlPortalActionsComponent } from './component/fl-portal-actions/fl-portal-actions.component';
import { FL_PORTAL_ACTION_I18N } from './i18n/fl-portal-action.i18n';
import { FlPortalActionsService } from './service/fl-portal-actions.service';
import { FlPortalActionsState } from './service/fl-portal-actions.state';

@NgModule({
  declarations: [FlPortalActionsComponent, FlPortalActionLineComponent],
  exports: [FlPortalActionsComponent],
  imports: [
    CommonModule,
    RouterModule,

    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,

    FlPortalModule,
    FlLoaderModule,
    FlTranslateModule,
    FlDialogModule,
  ],
})
export class FlPortalActionsModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlPortalActionsModule', FL_PORTAL_ACTION_I18N);
  }

  public static forRoot(): ModuleWithProviders<FlPortalActionsModule> {
    return {
      ngModule: FlPortalActionsModule,
      providers: [FlPortalActionsService, FlPortalActionsState],
    };
  }
}
