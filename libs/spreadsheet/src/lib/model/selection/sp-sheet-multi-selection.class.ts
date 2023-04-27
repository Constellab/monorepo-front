import {SpSheetSingleSelection, SpSheetSingleSelectionFull} from './sp-sheet-single-selection.class';
import {SpCell} from '../sp-cell.class';
import {SpSheet} from '../sp-sheet.class';
import {SpSheetSelection} from './sp-sheet-selection.class';
import {SpCellsMultipleRange} from './sp-cells-multiple-range.class';
import {SpSpreadsheetHelper} from '../../utils/sp-spreadsheet.helper';
import {SpSheetSelectionRange} from '../chart/sp-sheet-chart-selection-form.class';
import {SpCellCoordRange} from '../sp-cell-coord.class';

/**
 * Object to manager multiple selections
 */
export class SpSheetMultiSelection implements SpSheetSelection {

  selections: SpSheetSingleSelection[];

  constructor(selections: SpSheetSingleSelection[] = []) {
    this.selections = selections;
  }

  // generate a multi selection from a string like B2:G5,B5:T4 (separated by ',')
  public static fromString(sheet: SpSheet, selection: string): SpSheetMultiSelection {
    const selections: SpSheetSingleSelection[] = [];

    const strRanges: string[] = selection.split(SpSpreadsheetHelper.selectionsSplitter);
    for (const strRange of strRanges) {
      selections.push(SpSheetSingleSelectionFull.fromString(sheet, strRange));
    }

    return new SpSheetMultiSelection(selections);
  }

  // generate a multi selection from a SpSheetSelectionRange
  public static fromSelectionRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetMultiSelection {
    if (selectionRange.type === 'range') {
      return SpSheetMultiSelection.fromCellCoordsRange(sheet, selectionRange.selection);

    } else {
      return SpSheetMultiSelection.fromColumnNames(sheet, selectionRange.selection);
    }
  }

  // generate a multi selection from a liste of column names
  public static fromColumnNames(sheet: SpSheet, columnNames: string[]): SpSheetMultiSelection {
    const selections: SpSheetSingleSelection[] = [];

    for (const column of columnNames) {
      selections.push(SpSheetSingleSelectionFull.ColumnName(sheet, column));
    }

    return new SpSheetMultiSelection(selections);
  }

  // generate a multi selection from a liste of column names
  public static fromCellCoordsRange(sheet: SpSheet, ranges: SpCellCoordRange[]): SpSheetMultiSelection {
    const selections: SpSheetSingleSelection[] = [];

    for (const range of ranges) {
      selections.push(SpSheetSingleSelectionFull.FromCellCoordsRange(sheet, range));
    }

    return new SpSheetMultiSelection(selections);
  }


  public addSelection(selection: SpSheetSingleSelection): void {
    this.selections.push(selection);
  }

  public addSelections(selections: SpSheetSingleSelection[]): void {
    this.selections.push(...selections);
  }


  public getCellsFlat(): SpCell[] {
    const cells: SpCell[] = [];
    for (const selection of this.selections) {
      cells.push(...selection.getCellsFlat());
    }
    return cells;
  }

  public getCellsValuesFlat(): any[] {
    return this.getCellsFlat().map(cell => cell.value);
  }

  /**
   * Split all the selection into multiple column selection and flatten the result
   */
  public splitToColumnSelections(): SpSheetSingleSelection[] {
    const columnSelection: SpSheetSingleSelection[] = [];
    this.selections.forEach(selection => columnSelection.push(...selection.splitToColumnSelections()));
    return columnSelection;
  }

  /**
   * Split all the selection into multiple column selection and flatten the result
   */
  public splitToRowSelections(): SpSheetSingleSelection[] {
    const columnSelection: SpSheetSingleSelection[] = [];
    this.selections.forEach(selection => columnSelection.push(...selection.splitToRowSelections()));
    return columnSelection;
  }

  // return all selection as text like B2:G5,B5:T4 (separated by ',')
  public toString(): string {
    const ranges = new SpCellsMultipleRange(this.selections.map(selection => selection.getRange()));

    return ranges.toString();
  }
}
