import { SpSheetAction } from './sp-sheet.action';
import { SpSheet } from '../sp-sheet.class';
import { SpCellsRange } from '../selection/sp-cells-range.class';

/**
 * Action to create a new Column
 */
export class SpAddColumnAction extends SpSheetAction {
  constructor(sheetId: number, range: SpCellsRange) {
    super(sheetId, range);
    this.disabledSelectionAfterAction = true;
  }

  execute(sheet: SpSheet): boolean {
    sheet.insertColumn(this.range.from.column);
    return true;
  }

  rollback(sheet: SpSheet): boolean {
    sheet.deleteColumns(this.range.from.column, this.range.to.column);
    return true;
  }
}

/**
 * Action to create a new Row
 */
export class SpAddRowAction extends SpSheetAction {
  constructor(sheetId: number, range: SpCellsRange) {
    super(sheetId, range);
    this.disabledSelectionAfterAction = true;
  }

  execute(sheet: SpSheet): boolean {
    sheet.insertRow(this.range.from.row);
    return true;
  }

  rollback(sheet: SpSheet): boolean {
    sheet.deleteRows(this.range.from.row, this.range.to.row);
    return true;
  }
}

/**
 * Action to delete columns
 */
export class SpDeleteColumnAction extends SpSheetAction {
  constructor(
    sheetId: number,
    range: SpCellsRange,
    private values: any[][]
  ) {
    super(sheetId, range);
    this.disabledSelectionAfterAction = true;
  }

  execute(sheet: SpSheet): boolean {
    sheet.deleteColumns(this.range.from.column, this.range.to.column);
    return true;
  }

  rollback(sheet: SpSheet): boolean {
    // recreate the columns
    sheet.insertMultipleColumns(this.range.from.column, this.range.to.column);

    sheet.setValuesFromCoord(this.values, this.range.from);
    return true;
  }
}

/**
 * Action to delete rows
 */
export class SpDeleteRowAction extends SpSheetAction {
  constructor(
    sheetId: number,
    range: SpCellsRange,
    private values: any[][]
  ) {
    super(sheetId, range);
    this.disabledSelectionAfterAction = true;
  }

  execute(sheet: SpSheet): boolean {
    sheet.deleteRows(this.range.from.row, this.range.to.row);
    return true;
  }

  rollback(sheet: SpSheet): boolean {
    // recreate the columns
    sheet.insertMultipleRows(this.range.from.row, this.range.to.row);

    sheet.setValuesFromCoord(this.values, this.range.from);
    return true;
  }
}
