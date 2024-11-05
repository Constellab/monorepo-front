import { SpSheet } from '../sp-sheet.class';
import { SpSheetAction } from './sp-sheet.action';
import { SpCellsRange } from '../selection/sp-cells-range.class';

/**
 * Sheet action to update multiple cells value
 */
export class SpUpdateCellsAction extends SpSheetAction {
  constructor(
    sheetId: number,
    range: SpCellsRange,
    private newValues: any[][],
    private previousValues: any[][]
  ) {
    super(sheetId, range);
  }

  execute(sheet: SpSheet): boolean {
    sheet.setValuesFromCoord(this.newValues, this.range.from);
    return true;
  }

  rollback(sheet: SpSheet): boolean {
    sheet.setValuesFromCoord(this.previousValues, this.range.from);
    return true;
  }
}

/**
 * Sheet action to update single cell value
 */
export class SpSingleUpdateCellAction extends SpUpdateCellsAction {
  constructor(sheetId: number, range: SpCellsRange, newValue: any, previousValue: any) {
    super(sheetId, range, [[newValue]], [[previousValue]]);
  }
}
