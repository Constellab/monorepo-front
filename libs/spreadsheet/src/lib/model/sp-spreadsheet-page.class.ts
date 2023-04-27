import {Observable} from 'rxjs';
import {SpSheetHeaderInfoInput} from './sp-sheet-headers.class';

export interface SpSpreadsheetPage {
  data: any[][];
  rows: SpSheetHeaderInfoInput[];
}

/**
 * Object for the SpSpreadsheet component to manage pagination of the data (getting page)
 */
export interface SpSpreadsheetPageLoader {

  /**
   * Load the next page of data
   * @param fromRow inclusive
   */
  loadRows(fromRow: number): Observable<SpSpreadsheetPage>;

  /**
   * Load previous rows
   * @param toRow exclusive (get the rows before this index)
   */
  loadPreviousRows(toRow: number): Observable<SpSpreadsheetPage>;
}
