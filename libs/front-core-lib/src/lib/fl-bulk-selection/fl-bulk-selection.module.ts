import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlBulkSelectionPortalComponent } from './component/fl-bulk-selection-portal/fl-bulk-selection-portal.component';
import { FlBulkSelectionToggleComponent } from './component/fl-bulk-selection-toggle/fl-bulk-selection-toggle.component';
import { FlBulkSelectionDirective } from './directive/fl-bulk-selection.directive';
import { FL_BULK_SELECTION_I18N } from './i18n/fl-bulk-selection.i18n';

@NgModule({
  declarations: [FlBulkSelectionDirective, FlBulkSelectionPortalComponent, FlBulkSelectionToggleComponent],
  exports: [FlBulkSelectionDirective, FlBulkSelectionToggleComponent],
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, FlIconModule, FlTranslateModule],
})
export class FlBulkSelectionModule {
  constructor() {
    const translateService = inject(FlTranslateService);
    translateService.addModuleTranslation('FlBulkSelectionModule', FL_BULK_SELECTION_I18N);
  }
}
