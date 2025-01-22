import { Injectable, inject } from '@angular/core';
import { SpSheetAction } from '../model/action/sp-sheet.action';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import { SpSpreadsheetSelectionState } from './sp-spreadsheet-selection.state';
import { SpSheet } from '../model/sp-sheet.class';

/**
 * Shared instance for a spreadsheet that store the actions
 * and can undo/redo actions
 */
@Injectable()
export class SpSpreadsheetActionStore {
  private state = inject(SpSpreadsheetState);
  private selectionState = inject(SpSpreadsheetSelectionState);

  // number of saved action to undo/redo
  private readonly actionHistoryLength: number = 100;

  // list of stored action, the first one, is the last made
  private actions: SpSheetAction[] = [];

  // index of the current executed action
  private currentAction: number = 0;

  public executeNewAction(action: SpSheetAction): void {
    this.executeAction(action);
    this.storeAction(action);
  }

  public redoLastAction(): void {
    if (this.currentAction <= 0) {
      return;
    }
    const action: SpSheetAction = this.actions[this.currentAction - 1];
    if (action == null) {
      return;
    }

    this.executeAction(action);
    this.currentAction--;

    if (!action.disabledSelectionAfterAction) {
      this.selectionState.setSelection(this.getSheet(action.sheetId), action.range);
    }
  }

  private executeAction(action: SpSheetAction): void {
    const sheet: SpSheet = this.getSheet(action.sheetId);

    if (sheet == null) {
      console.error(`Can't find the sheet with id ${action.sheetId}`);
      return;
    }
    action.execute(sheet);
  }

  public rollbackLastAction(): void {
    const action: SpSheetAction = this.actions[this.currentAction];
    if (action == null) {
      return;
    }
    const sheet: SpSheet = this.getSheet(action.sheetId);

    if (sheet == null) {
      console.error(`Can't find the sheet with id ${action.sheetId}`);
      return;
    }
    action.rollback(sheet);
    this.currentAction++;

    // show the correct sheet
    this.state.spreadsheet.selectSheet(sheet.id);

    if (!action.disabledSelectionAfterAction) {
      this.selectionState.setSelection(sheet, action.range);
    }
  }

  private getSheet(id: number): SpSheet {
    return this.state.getSheet(id);
  }

  private storeAction(action: SpSheetAction): void {
    // clear all the action that were redo
    this.actions.splice(0, this.currentAction);

    this.actions.unshift(action);
    if (this.actions.length > this.actionHistoryLength) {
      // clear the last action for space memory
      this.actions.pop();
    }
    this.currentAction = 0;
  }
}
