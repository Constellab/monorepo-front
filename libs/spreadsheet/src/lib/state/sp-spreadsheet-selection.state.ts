import { Injectable, OnDestroy } from '@angular/core';
import {
  SpSheetSingleSelection,
  SpSheetSingleSelectionFull,
} from '../model/selection/sp-sheet-single-selection.class';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpSpreadsheetState } from './sp-spreadsheet.state';
import { SpSheet } from '../model/sp-sheet.class';
import { SpCellsRange } from '../model/selection/sp-cells-range.class';
import { SpCellCoord } from '../model/sp-cell-coord.class';

/**
 * Unique state shared across the spreadsheet to manage the selection
 */
@Injectable()
export class SpSpreadsheetSelectionState implements OnDestroy {
  private currentSelection$: BehaviorSubject<SpSheetSingleSelectionFull> =
    new BehaviorSubject<SpSheetSingleSelectionFull>(null);

  constructor(private state: SpSpreadsheetState) {}

  public init(): void {
    this.clearSelectionOnNewSheet();
  }

  // listen to the sheet change and clear selection when we changed the sheet
  private clearSelectionOnNewSheet(): void {
    this.state.currentSheet$.subscribe(() => this.clearCurrentSelection());
  }

  // todo to change with current sheet
  private get currentSheet(): SpSheet {
    return this.state.currentSheet;
  }

  /**
   * Return a simple SpSheetSelection without the edit method because
   * the outside must not edit the selection
   */
  public get currentSelection(): SpSheetSingleSelection {
    return this.currentSelection$.value;
  }

  private get currentSelectionFull(): SpSheetSingleSelectionFull {
    return this.currentSelection$.value;
  }

  public selectUniqueCell(coord: SpCellCoord): SpSheetSingleSelection {
    const selection: SpSheetSingleSelectionFull = SpSheetSingleSelectionFull.Single(
      this.currentSheet,
      coord.row,
      coord.column
    );
    this.newSelection(selection);
    return selection;
  }

  public selectMultipleCell(from: SpCellCoord, to: SpCellCoord): SpSheetSingleSelection {
    const selection: SpSheetSingleSelectionFull = SpSheetSingleSelectionFull.Multiple(
      this.currentSheet,
      from.row,
      from.column,
      to.row,
      to.column
    );
    this.newSelection(selection);
    return selection;
  }

  public selectUniqueRow(rowIndex: number): SpSheetSingleSelection {
    const selection: SpSheetSingleSelectionFull = SpSheetSingleSelectionFull.Rows(
      this.currentSheet,
      rowIndex,
      rowIndex
    );
    this.newSelection(selection);
    return selection;
  }

  public selectUniqueColumn(columnIndex: number): SpSheetSingleSelection {
    const selection: SpSheetSingleSelectionFull = SpSheetSingleSelectionFull.Columns(
      this.currentSheet,
      columnIndex,
      columnIndex
    );
    this.newSelection(selection);
    return selection;
  }

  public selectAllColumns(): SpSheetSingleSelection {
    const selection: SpSheetSingleSelectionFull = SpSheetSingleSelectionFull.Columns(
      this.currentSheet,
      0,
      this.currentSheet.getLoadedColumnsCount() - 1
    );
    this.newSelection(selection);
    return selection;
  }

  public setSelection(sheet: SpSheet, range: SpCellsRange): SpSheetSingleSelection {
    const selection: SpSheetSingleSelectionFull = SpSheetSingleSelectionFull.FromRange(sheet, range);
    this.newSelection(selection);
    return selection;
  }

  private newSelection(selection: SpSheetSingleSelectionFull): void {
    this.currentSelection$.next(selection);
  }

  public clearCurrentSelection(): void {
    this.currentSelection$.next(null);
  }

  public expandSelection(coord: SpCellCoord): void {
    if (!this.currentSheet.coordIsLoaded(coord)) {
      return;
    }

    const currentSelectionFull: SpSheetSingleSelectionFull = this.currentSelectionFull;

    // check if the current selection is valid to expand
    if (
      currentSelectionFull == null ||
      (currentSelectionFull.type !== 'single' && currentSelectionFull.type !== 'multiple')
    ) {
      return;
    }

    const endCoord: SpCellCoord = currentSelectionFull.getEndCoord();
    // if the end selection didn't change
    if (endCoord.row === coord.row && endCoord.column === coord.column) {
      return;
    }

    const newSelection: SpSheetSingleSelectionFull = currentSelectionFull.expandSelection(
      coord.row,
      coord.column
    );
    this.currentSelection$.next(newSelection);
  }

  public expandRowsSelection(rowIndex: number): void {
    if (this.currentSelectionFull == null || this.currentSelectionFull.type !== 'rows') {
      return;
    }

    const newSelection: SpSheetSingleSelectionFull = this.currentSelectionFull.expandRowsSelection(rowIndex);

    this.currentSelection$.next(newSelection);
  }

  public expandColumnsSelection(columnIndex: number): void {
    if (this.currentSelectionFull == null || this.currentSelectionFull.type !== 'columns') {
      return;
    }

    const newSelection: SpSheetSingleSelectionFull =
      this.currentSelectionFull.expandColumnsSelection(columnIndex);

    this.currentSelection$.next(newSelection);
  }

  public getSelection$(): Observable<SpSheetSingleSelection> {
    return this.currentSelection$.asObservable();
  }

  /**
   * Expand current selection with a shift from the current coord
   * @param rowShift
   * @param columnShift
   */
  public expandSelectionWithShift(rowShift: number, columnShift: number): void {
    const newCoord: SpCellCoord = this.shiftCurrentSelection(rowShift, columnShift);

    if (newCoord) {
      switch (this.currentSelection.type) {
        case 'rows':
          this.expandRowsSelection(newCoord.row);
          break;
        case 'columns':
          this.expandColumnsSelection(newCoord.column);
          break;
        default:
          this.expandSelection(newCoord);
          break;
      }
    }
  }

  public moveCurrentSelection(rowShift: number, columnShift: number): SpSheetSingleSelection | null {
    const newCoord: SpCellCoord = this.shiftCurrentSelection(rowShift, columnShift);

    if (newCoord) {
      switch (this.currentSelection.type) {
        case 'rows':
          return this.selectUniqueRow(newCoord.row);
        case 'columns':
          return this.selectUniqueColumn(newCoord.column);
        default:
          return this.selectUniqueCell(newCoord);
      }
    }

    return null;
  }

  // shit the current selection coord
  // return null if the new coord is not valid
  private shiftCurrentSelection(rowShift: number, columnShift: number): SpCellCoord | null {
    const selection: SpSheetSingleSelection = this.currentSelection;

    if (selection != null) {
      const coord: SpCellCoord = {
        row: selection.endRow + rowShift,
        column: selection.endColumn + columnShift,
      };

      if (this.currentSheet.coordIsLoaded(coord)) {
        return coord;
      }
    }

    return null;
  }

  public hasSelection(): boolean {
    return this.currentSelection != null;
  }

  ngOnDestroy(): void {
    this.currentSelection$.complete();
  }
}
