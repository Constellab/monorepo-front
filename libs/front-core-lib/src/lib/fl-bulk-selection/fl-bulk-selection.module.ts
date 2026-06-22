import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { FlIconModule } from '../fl-svg-icon/fl-icon.module';
import { FlTranslateModule } from '../fl-translate/fl-translate.module';
import { FlBulkActionResultDialogComponent } from './component/fl-bulk-action-result-dialog/fl-bulk-action-result-dialog.component';
import { FlBulkSelectionPortalComponent } from './component/fl-bulk-selection-portal/fl-bulk-selection-portal.component';
import { FlBulkSelectionToggleComponent } from './component/fl-bulk-selection-toggle/fl-bulk-selection-toggle.component';
import { FlBulkSelectionDirective } from './directive/fl-bulk-selection.directive';
import { FL_BULK_SELECTION_I18N } from './i18n/fl-bulk-selection.i18n';

@NgModule({
  declarations: [
    FlBulkSelectionDirective,
    FlBulkSelectionPortalComponent,
    FlBulkSelectionToggleComponent,
    FlBulkActionResultDialogComponent,
  ],
  exports: [FlBulkSelectionDirective, FlBulkSelectionToggleComponent, FlBulkActionResultDialogComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FlIconModule,
    FlTranslateModule,
    FlDialogModule,
  ],
})
export class FlBulkSelectionModule {
  constructor() {
    const translateService = inject(FlTranslateService);
    translateService.addModuleTranslation('FlBulkSelectionModule', FL_BULK_SELECTION_I18N);
  }
}
