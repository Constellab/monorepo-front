import { RvResourceViewBase } from './rv-resource-view.class';
import {
  SpSheet,
  SpSheetColumnSortDirection,
  SpSheetHeaders,
  SpSpreadsheet,
  SpSpreadsheetFactory,
} from '@monorepo/spreadsheet';

export interface RvResourceViewTable extends RvResourceViewBase {
  type: 'table-view' | 'dataset-view' | 'tabular-view';
  data: RvResourceViewTableData;
}

export interface RvResourceViewTableData {
  table: any[][];
  rows: RvResourceViewTableHeader[];
  columns: RvResourceViewTableHeader[];
  from_column: number;
  from_row: number;
  number_of_columns_per_page: number;
  number_of_rows_per_page: number;
  total_number_of_columns: number;
  total_number_of_rows: number;
  sort?: {
    column: string;
    direction: SpSheetColumnSortDirection;
  };
}

export interface RvResourceViewTableHeader {
  name: string;
  tags: Record<string, string>;
}

/**
 * Convert a Table view to a Spreadsheet
 * @param table
 * @param ignoreOffsets if true the offsets (fromRow and fromCol) are ignored
 */
export function rvTableToSpreadsheet(
  table: RvResourceViewTable,
  ignoreOffsets: boolean = false
): SpSpreadsheet {
  const spreadSheet: SpSpreadsheet = new SpSpreadsheet();
  // if the resource is a csv file
  const sheet: SpSheet = SpSpreadsheetFactory.fromArray(table.data.table, table.title ?? 'Sheet 1');

  sheet.totalColumnsCount = table.data.total_number_of_columns;
  sheet.totalRowsCount = table.data.total_number_of_rows;

  sheet.columns = new SpSheetHeaders(table.data.columns, {
    headerName: table.data.sort?.column,
    direction: table.data.sort?.direction,
  });
  sheet.rows = new SpSheetHeaders(table.data.rows);

  if (!ignoreOffsets) {
    sheet.rowOffset = table.data.from_row - 1; // -1 because communication are based on 1-based index
    sheet.columnOffset = table.data.from_column - 1; // -1 because communication are based on 1-based index
  }
  spreadSheet.addSheet(sheet);
  return spreadSheet;
}
