import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlLoaderModule } from '../fl-loader/fl-loader.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlAsyncSectionComponent } from './fl-async-section/fl-async-section.component';
import { flSectionI18n } from './fl-section.i18n';
import { FlSectionComponent } from './fl-section/fl-section.component';
import { FlSectionActionsComponent } from './fl-section-actions/fl-section-actions.component';
import { FlSectionBodyDirective } from './fl-section-body';
import { FlSectionHeaderComponent } from './fl-section-header/fl-section-header.component';

/**
 * Module SectionList which is a section of a page displaying a list of element
 */
@NgModule({
  declarations: [
    FlSectionComponent,
    FlSectionHeaderComponent,
    FlSectionActionsComponent,
    FlSectionBodyDirective,
    FlAsyncSectionComponent,
  ],
  exports: [
    FlSectionComponent,
    FlSectionHeaderComponent,
    FlSectionActionsComponent,
    FlSectionBodyDirective,
    FlAsyncSectionComponent,
  ],
  imports: [
    CommonModule,

    MatIconModule,
    PortalModule,

    FlLoaderModule,
    FlTranslateModule,
    FlCoreComponentModule,
  ],
})
export class FlSectionModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('FlSectionModule', flSectionI18n);
  }
}
