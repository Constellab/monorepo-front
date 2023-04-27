import {SpCellsRange} from './sp-cells-range.class';
import {SpSpreadsheetHelper} from '../../utils/sp-spreadsheet.helper';
import {SpCellCoordRange} from '../sp-cell-coord.class';


export class SpCellsMultipleRange {

  ranges: SpCellsRange[];

  constructor(ranges: SpCellsRange[] = []) {
    this.ranges = ranges;
  }

  // generate a multi selection from a string like B2:G5,B5:T4 (separated by ',')
  public static fromString(selection: string): SpCellsMultipleRange {
    const ranges: SpCellsRange[] = [];

    const strRanges: string[] = selection.split(SpSpreadsheetHelper.selectionsSplitter);
    for (const strRange of strRanges) {
      ranges.push(SpCellsRange.MultipleFromString(strRange));
    }

    return new SpCellsMultipleRange(ranges);
  }

  public static fromCellCoordsRange(coords: SpCellCoordRange[]): SpCellsMultipleRange {
    const ranges = coords.map(coord => SpCellsRange.MultipleFromCellCoordsRange(coord));
    return new SpCellsMultipleRange(ranges);
  }

  public addRange(range: SpCellsRange): void {
    this.ranges.push(range);
  }

  public toCoords(): SpCellCoordRange[] {
    return this.ranges.map(range => range.toCoords());
  }

  public countCells(): number {
    let sum = 0;
    for (const range of this.ranges) {
      sum += range.countCells();
    }
    return sum;
  }

  // return all selection as text like B2:G5,B5:T4 (separated by ',')
  public toString(): string {
    let str: string = '';
    for (const range of this.ranges) {
      if (str !== '') {
        str += SpSpreadsheetHelper.selectionsSplitter;
      }
      str += range.toString();
    }
    return str;
  }

}

