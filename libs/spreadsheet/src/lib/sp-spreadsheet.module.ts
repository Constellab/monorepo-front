import { NgModule } from '@angular/core';
import { SpSpreadsheetSheetSelectionComponent } from './component/sp-spreadsheet-sheet-selection/sp-spreadsheet-sheet-selection.component';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpSpreadsheetComponent } from './component/sp-spreadsheet/sp-spreadsheet.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SpSpreadsheetCellComponent } from './component/sp-spreadsheet-cell/sp-spreadsheet-cell.component';
import { SpSheetChartSerieSelectionComponent } from './component/sp-sheet-chart-serie-selection/sp-sheet-chart-serie-selection.component';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SpSpreadsheetHeaderCellComponent } from './component/sp-spreadsheet-header-cell/sp-spreadsheet-header-cell.component';
import { MatChipsModule } from '@angular/material/chips';
import { SpCellHeaderPipe } from './pipe/sp-cell-header.pipe';
import { SpSpreadsheetHeaderTagsComponent } from './component/sp-spreadsheet-header-tags/sp-spreadsheet-header-tags.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SpSheetChartSelectionComponent } from './component/sp-sheet-chart-selection/sp-sheet-chart-selection.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SpSpreadsheetDrawerComponent } from './component/sp-spreadsheet-drawer/sp-spreadsheet-drawer.component';
import { SpSpreadsheetHeaderInfoComponent } from './component/sp-spreadsheet-header-info/sp-spreadsheet-header-info.component';
import { spSpreadsheetI18n } from './i18n/sp-spreadsheet.i18n';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { SpSpreadsheetSelectionListenerComponent } from './component/sp-spreadsheet-selection-listener/sp-spreadsheet-selection-listener.component';
import { SpSpreadsheetCellInfoComponent } from './component/sp-spreadsheet-cell-info/sp-spreadsheet-cell-info.component';
import { SpSheetRangesInputComponent } from './component/sp-sheet-ranges-input/sp-sheet-ranges-input.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';

import {
  FlAutocompleteMultipleModule,
  FlCoreComponentModule,
  FlCoreDirectiveModule,
  FlCorePipeModule,
  FlDrawerModule,
  FlIconModule,
  FlKeyValueModule,
  FlLoaderModule,
  FlMenuDynamicModule,
  FlPortalActionsModule,
  FlPortalModule,
  FlResizeModule,
  FlSectionModule,
  FlTagModule,
  FlTextIconModule,
  FlTranslateModule,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { ChChartModule } from '@monorepo/chart';

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
  constructor(translateService: FlTranslateService) {
    translateService.addModuleTranslation('SpSpreadsheetModule', spSpreadsheetI18n);
  }
}
