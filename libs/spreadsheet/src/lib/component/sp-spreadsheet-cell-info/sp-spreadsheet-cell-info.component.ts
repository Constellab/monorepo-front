import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';

import { SpCellWithCoord } from '../../model/selection/sp-sheet-single-selection.class';
import { SpCell } from '../../model/sp-cell.class';
import { SpSheetHeaderInfo } from '../../model/sp-sheet-headers.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';

/**
 * Small portal to show information about a cell
 */
@Component({
  selector: 'sp-spreadsheet-cell-info',
  templateUrl: './sp-spreadsheet-cell-info.component.html',
  styleUrls: ['./sp-spreadsheet-cell-info.component.scss'],
  standalone: false,
})
export class SpSpreadsheetCellInfoComponent {
  private state = inject(SpSpreadsheetState);

  cell: SpCell;

  columnInfo: SpSheetHeaderInfo;
  rowInfo: SpSheetHeaderInfo;

  constructor() {
    const cell = inject<SpCellWithCoord>(FL_PORTAL_DATA);
    const state = this.state;

    this.cell = cell.cell;
    const coord = cell.coord;
    const sheet = state.currentSheet;
    this.columnInfo = sheet.getColumnInfo(coord.column);
    this.rowInfo = sheet.getRowInfo(coord.row);
  }
}
