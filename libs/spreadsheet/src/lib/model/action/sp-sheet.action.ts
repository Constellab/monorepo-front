import {SpSheet} from '../sp-sheet.class';
import {SpCellsRange} from '../selection/sp-cells-range.class';

export abstract class SpSheetAction {

  // if true the selection is not reset after action undo/redo
  public disabledSelectionAfterAction: boolean = false;

  protected constructor(public sheetId: number, public range: SpCellsRange) {
  }

  abstract execute(sheet: SpSheet): boolean;

  abstract rollback(sheet: SpSheet): boolean;
}

