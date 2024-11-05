import { Injectable } from '@angular/core';
import { SpSheetAction } from '../model/action/sp-sheet.action';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import {
  SpSheetSingleSelection,
  SpSheetSingleSelectionFull,
} from '../model/selection/sp-sheet-single-selection.class';
import { SpSheet } from '../model/sp-sheet.class';
import { SpCell } from '../model/sp-cell.class';
import { SpSpreadsheetSelectionState } from './sp-spreadsheet-selection.state';
import { SpSingleUpdateCellAction, SpUpdateCellsAction } from '../model/action/sp-update-cell.action';
import { SpSpreadsheetActionStore } from './sp-spreadsheet-action.store';
import {
  SpAddColumnAction,
  SpAddRowAction,
  SpDeleteColumnAction,
  SpDeleteRowAction,
} from '../model/action/sp-header-cell.action';
import { SpCellCoord } from '../model/sp-cell-coord.class';

/**
 * Unique state shared across the spreadsheet to trigger update actions
 * All action must be set here to be able to revert it
 */
@Injectable()
export class SpSpreadsheetActions {
  constructor(
    private state: SpSpreadsheetState,
    private selectionState: SpSpreadsheetSelectionState,
    private actionStore: SpSpreadsheetActionStore
  ) {}

  public updateCellValue(newValue: any, coord: SpCellCoord): void {
    const sheet: SpSheet = this.state.currentSheet;
    const cell: SpCell = sheet.getCell(coord.row, coord.column);

    const action: SpSheetAction = new SpSingleUpdateCellAction(
      sheet.id,
      SpSheetSingleSelectionFull.Single(sheet, coord.row, coord.column).getRange(),
      newValue,
      cell.value
    );
    this.actionStore.executeNewAction(action);
  }

  public updateCellsValues(newValues: any[][], selection: SpSheetSingleSelection): void {
    const sheet: SpSheet = this.state.currentSheet;

    const action: SpSheetAction = new SpUpdateCellsAction(
      sheet.id,
      selection.getRange(),
      newValues,
      selection.getCellsValues()
    );
    this.actionStore.executeNewAction(action);
  }

  public addColumn(): void {
    const sheet: SpSheet = this.state.currentSheet;
    const selection: SpSheetSingleSelection = this.selectionState.currentSelection;

    const action: SpSheetAction = new SpAddColumnAction(sheet.id, selection.getRange());

    // clear selection after to avoid weird selection
    // before the execution, otherwise the current selection is not correct
    this.selectionState.clearCurrentSelection();

    this.actionStore.executeNewAction(action);
  }

  public addRow(): void {
    const sheet: SpSheet = this.state.currentSheet;
    const selection: SpSheetSingleSelection = this.selectionState.currentSelection;

    const action: SpSheetAction = new SpAddRowAction(sheet.id, selection.getRange());

    // clear selection after to avoid weird selection
    // before the execution, otherwise the current selection is not correct
    this.selectionState.clearCurrentSelection();

    this.actionStore.executeNewAction(action);
  }

  public deleteColumns(): void {
    const sheet: SpSheet = this.state.currentSheet;
    const selection: SpSheetSingleSelection = this.selectionState.currentSelection;

    const action: SpSheetAction = new SpDeleteColumnAction(
      sheet.id,
      selection.getRange(),
      selection.getCellsValues()
    );

    // clear selection after to avoid weird selection
    // before the execution, otherwise the current selection is not correct
    this.selectionState.clearCurrentSelection();

    this.actionStore.executeNewAction(action);
  }

  public deleteRows(): void {
    const sheet: SpSheet = this.state.currentSheet;
    const selection: SpSheetSingleSelection = this.selectionState.currentSelection;

    const action: SpSheetAction = new SpDeleteRowAction(
      sheet.id,
      selection.getRange(),
      selection.getCellsValues()
    );

    // clear selection after to avoid weird selection
    // before the execution, otherwise the current selection is not correct
    this.selectionState.clearCurrentSelection();

    this.actionStore.executeNewAction(action);
  }
}
