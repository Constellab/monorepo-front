import {SpSheet} from '../sp-sheet.class';
import {SpCell} from '../sp-cell.class';
import {SpSheetSelection} from './sp-sheet-selection.class';
import {SpCellsRange, SpCellsRangeType} from './sp-cells-range.class';
import {SpCellCoord, SpCellCoordRange} from '../sp-cell-coord.class';
import {SpSheetSelectionRange} from '../chart/sp-sheet-chart-selection-form.class';

export interface SpCellWithCoord {
  coord: SpCellCoord;
  cell: SpCell;
}


/**
 * Class containing the selection of a sheet with only read method
 * This object is immutable
 */
export class SpSheetSingleSelection implements SpSheetSelection {

  protected constructor(
    protected sheet: SpSheet,
    protected range: SpCellsRange) {
  }


  public getCellsFlat(): SpCell[] {
    return this.sheet.getCellsFromCoordsFlat(this.range.from, this.range.to);
  }

  public getCells(): SpCell[][] {
    return this.sheet.getCellsFromCoords(this.range.from, this.range.to);
  }

  public getCellsValues(): any[][] {
    return this.getCells().map(rows => rows.map(cell => cell.value));
  }

  public getCellsValuesFlat(): any[] {
    return this.getCellsFlat().map(cell => cell.value);
  }

  /**
   * return the first column where the selection started
   * If this is a row or a column selection, we return the first column
   */
  public getFirstSelectedCell(): SpCell {
    const coord: SpCellCoord = this.range.getFirstSelectedCellCoord();
    return this.sheet.getCell(coord.row, coord.column);
  }

  /**
   * return a list of selection, one for each row
   */
  public splitToRowSelections(): SpSheetSingleSelection[] {
    const selections: SpSheetSingleSelection[] = [];
    const from: SpCellCoord = this.range.from;
    const to: SpCellCoord = this.range.to;

    for (let i = from.row; i <= to.row; i++) {
      selections.push(SpSheetSingleSelectionFull.Multiple(this.sheet, i, from.column, i, to.column));
    }

    return selections;
  }

  /**
   * return a list of selection, one for each column
   */
  public splitToColumnSelections(): SpSheetSingleSelection[] {
    const selections: SpSheetSingleSelection[] = [];
    const from: SpCellCoord = this.range.from;
    const to: SpCellCoord = this.range.to;

    // if there is only one row selection, we return only one row
    if (from.row === to.row) {
      return [SpSheetSingleSelectionFull.Multiple(this.sheet, from.row, from.column, to.row, to.column)];
    }

    for (let i = from.column; i <= to.column; i++) {
      selections.push(SpSheetSingleSelectionFull.Multiple(this.sheet, from.row, i, to.row, i));
    }

    return selections;
  }

  public get startRow(): number {
    return this.range.startRow;
  }

  public get startColumn(): number {
    return this.range.startColumn;
  }

  public get endRow(): number {
    return this.range.endRow;
  }

  public get endColumn(): number {
    return this.range.endColumn;
  }

  public get type(): SpCellsRangeType {
    return this.range.type;
  }

  public get from(): SpCellCoord {
    return this.range.from;
  }

  public get to(): SpCellCoord {
    return this.range.to;
  }

  public getRange(): SpCellsRange {
    return this.range;
  }

  public getFirstSelectedCellCoord(): SpCellCoord {
    return this.range.getFirstSelectedCellCoord();

  }

  // return true if the coord are within the selection
  public coordIsSelected(coord: SpCellCoord): boolean {
    return this.range.coordIsSelected(coord);

  }

  // return true if the row is within selection
  public rowIsSelected(row: number): boolean {
    return this.range.rowIsSelected(row);
  }

  // return true if the column is within selection
  public columnIsSelected(column: number): boolean {
    return this.range.columnIsSelected(column);
  }

  // return selection as text like B2:G5
  public toString(): string {
    return this.range.toString();
  }

  /**
   * Export to a SpSheetSelectionRange and includes the offset of the sheet
   */
  public toSpSheetSelectionRange(): SpSheetSelectionRange {
    if (this.type === 'columns') {
      return {
        type: 'columns',
        selection: this.sheet.getColumnNames(this.from.column, this.to.column)
      };
    } else {
      const coords = this.getRange().toCoords();
      return {
        type: 'range',
        selection: [{
          from: this.sheet.getCoordsWithOffset(coords.from),
          to: this.sheet.getCoordsWithOffset(coords.to)
        }]
      };
    }
  }


  // public getDifference(newSelection: SpSheetSelectionChange): SpSheetSelectionDifference {
  //   // the difference only work if both selection have the same start
  //   if (newSelection.startRow !== this.startRow || newSelection.startColumn !== this.startColumn) {
  //     throw new Error('The selection don\'t have the same start');
  //   }
  //
  //
  //   return {
  //     row: this.rowDirection === 'normal' ? newSelection.endRow - this.endRow :
  //       this.endRow - newSelection.endRow,
  //     column: this.columnDirection === 'normal' ? newSelection.endColumn - this.endColumn :
  //       this.endColumn - newSelection.endColumn,
  //   };
  // }
}

/**
 * Class containing the selection of a sheet with only also update method
 * This object is immutable, it returns new objects
 */
export class SpSheetSingleSelectionFull extends SpSheetSingleSelection {
  constructor(
    sheet: SpSheet,
    range: SpCellsRange) {
    super(sheet, range);
  }

  public static Single(sheet: SpSheet, row: number, column: number): SpSheetSingleSelectionFull {
    return new SpSheetSingleSelectionFull(sheet, new SpCellsRange('single', row, column, row, column));
  }

  public static Multiple(sheet: SpSheet,
                         startRow: number, startColumn: number,
                         endRow: number, endColumn: number): SpSheetSingleSelectionFull {
    return new SpSheetSingleSelectionFull(sheet, new SpCellsRange('multiple', startRow, startColumn, endRow, endColumn));
  }

  public static Columns(sheet: SpSheet, from: number, to: number): SpSheetSingleSelectionFull {
    return new SpSheetSingleSelectionFull(sheet, new SpCellsRange('columns', 0, from, sheet.getLoadedRowsCount() - 1, to));
  }

  public static ColumnName(sheet: SpSheet, columnName: string): SpSheetSingleSelectionFull {
    const index = sheet.findColumnIndex(columnName);

    if (index === -1) {
      throw new Error(`Column '${columnName}' not found`);
    }

    return SpSheetSingleSelectionFull.Columns(sheet, index, index);
  }

  public static Rows(sheet: SpSheet, from: number, to: number): SpSheetSingleSelectionFull {
    return new SpSheetSingleSelectionFull(sheet, new SpCellsRange('rows', from, 0, to, sheet.getLoadedColumnsCount() - 1));
  }

  public static FromRange(sheet: SpSheet, range: SpCellsRange): SpSheetSingleSelectionFull {
    return new SpSheetSingleSelectionFull(sheet, range);
  }

  public static FromCellCoordsRange(sheet: SpSheet, cellsRange: SpCellCoordRange): SpSheetSingleSelectionFull {
    const range = SpCellsRange.MultipleFromCellCoordsRange(cellsRange);
    range.to.column -= sheet.columnOffset;
    range.to.row -= sheet.rowOffset;
    range.from.column -= sheet.columnOffset;
    range.from.row -= sheet.rowOffset;
    return new SpSheetSingleSelectionFull(sheet, range);
  }

  /**
   * create selection from string formatted like A2:B5
   * @param sheet
   * @param selection
   * @constructor
   */
  public static fromString(sheet: SpSheet, selection: string): SpSheetSingleSelectionFull {
    return new SpSheetSingleSelectionFull(sheet, SpCellsRange.MultipleFromString(selection));
  }

  // return a new instance of SpSheetSelectionChange wih expanded selection
  public expandSelection(row: number, column: number): SpSheetSingleSelectionFull {
    return SpSheetSingleSelectionFull.Multiple(this.sheet, this.range.startRow, this.range.startColumn, row, column);
  }

  // return a new instance of SpSheetSelectionChange wih expanded selection
  public expandRowsSelection(row: number): SpSheetSingleSelectionFull {
    return SpSheetSingleSelectionFull.Rows(this.sheet, this.range.startRow, row);
  }

  // return a new instance of SpSheetSelectionChange wih expanded selection
  public expandColumnsSelection(column: number): SpSheetSingleSelectionFull {
    return SpSheetSingleSelectionFull.Columns(this.sheet, this.range.startColumn, column);
  }

  public getEndCoord(): SpCellCoord {
    return {
      row: this.range.endRow,
      column: this.range.endColumn
    };
  }
}
