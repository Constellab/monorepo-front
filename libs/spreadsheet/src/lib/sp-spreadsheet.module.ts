import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChChartModule } from '@monorepo/chart';
import { FlAutocompleteMultipleModule } from '@monorepo/front-core-lib/fl-autocomplete-multiple';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlCoreDirectiveModule } from '@monorepo/front-core-lib/fl-core-directive';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDrawerModule } from '@monorepo/front-core-lib/fl-drawer';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlMenuDynamicModule } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalModule } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsModule } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlResizeModule } from '@monorepo/front-core-lib/fl-resize';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlTranslateModule } from '@monorepo/front-core-lib/fl-translate';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';

import { SpSheetChartSelectionComponent } from './component/sp-sheet-chart-selection/sp-sheet-chart-selection.component';
import { SpSheetChartSerieSelectionComponent } from './component/sp-sheet-chart-serie-selection/sp-sheet-chart-serie-selection.component';
import { SpSheetRangesInputComponent } from './component/sp-sheet-ranges-input/sp-sheet-ranges-input.component';
import { SpSpreadsheetComponent } from './component/sp-spreadsheet/sp-spreadsheet.component';
import { SpSpreadsheetCellComponent } from './component/sp-spreadsheet-cell/sp-spreadsheet-cell.component';
import { SpSpreadsheetCellInfoComponent } from './component/sp-spreadsheet-cell-info/sp-spreadsheet-cell-info.component';
import { SpSpreadsheetDrawerComponent } from './component/sp-spreadsheet-drawer/sp-spreadsheet-drawer.component';
import { SpSpreadsheetHeaderCellComponent } from './component/sp-spreadsheet-header-cell/sp-spreadsheet-header-cell.component';
import { SpSpreadsheetHeaderInfoComponent } from './component/sp-spreadsheet-header-info/sp-spreadsheet-header-info.component';
import { SpSpreadsheetHeaderTagsComponent } from './component/sp-spreadsheet-header-tags/sp-spreadsheet-header-tags.component';
import { SpSpreadsheetSelectionListenerComponent } from './component/sp-spreadsheet-selection-listener/sp-spreadsheet-selection-listener.component';
import { SpSpreadsheetSheetSelectionComponent } from './component/sp-spreadsheet-sheet-selection/sp-spreadsheet-sheet-selection.component';
import { SP_SPREADSHEET_I18N } from './i18n/sp-spreadsheet.i18n';
import { SpCellHeaderPipe } from './pipe/sp-cell-header.pipe';

@NgModule({
  declarations: [
    SpSpreadsheetComponent,
    SpSpreadsheetCellComponent,
    SpSpreadsheetHeaderCellComponent,
    SpCellHeaderPipe,
    SpSheetChartSelectionComponent,
    SpSpreadsheetSelectionListenerComponent,
    SpSheetChartSerieSelectionComponent,
    SpSpreadsheetSheetSelectionComponent,
    SpSpreadsheetDrawerComponent,
    SpSpreadsheetHeaderInfoComponent,
    SpSheetRangesInputComponent,
    SpSpreadsheetCellInfoComponent,
    SpSpreadsheetHeaderTagsComponent,
  ],
  exports: [SpSpreadsheetComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    FlCoreDirectiveModule,
    FlPortalModule,
    FlIconModule,
    FlCorePipeModule,
    FlTranslateModule,
    FlMenuDynamicModule,
    FlTextIconModule,
    FlDrawerModule,
    FlSectionModule,
    FlTagModule,
    FlCoreComponentModule,
    FlKeyValueModule,
    FlAutocompleteMultipleModule,
    FlResizeModule,
    FlLoaderModule,
    FlPortalActionsModule,

    ChChartModule,

    ScrollingModule,
    MatMenuModule,
    MatIconModule,
    DragDropModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDividerModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatCheckboxModule,
  ],
})
export class SpSpreadsheetModule {
  constructor() {
    const translateService = inject(FlTranslateService);

    translateService.addModuleTranslation('SpSpreadsheetModule', SP_SPREADSHEET_I18N);
  }
}
