import { SpCell } from '../sp-cell.class';

/**
 * Interface representing a selection, this can be a single or a multiple selection
 */
export interface SpSheetSelection {
  getCellsFlat(): SpCell[];

  getCellsValuesFlat(): any[];

  toString(): string;
}
