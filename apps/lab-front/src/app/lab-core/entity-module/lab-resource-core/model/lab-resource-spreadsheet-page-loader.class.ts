import { SpSpreadsheetPage, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { Observable } from 'rxjs';
import { LabResourceTableService } from '../../../entity-service/lab-resource-table.service';
import { RvResourceViewTable, RvViewConfig } from '@monorepo/resource-view';
import { map } from 'rxjs/operators';

/**
 * Class to make request to lab api when loading a spreadsheet page
 */
export class LabResourceSpreadsheetPageLoader implements SpSpreadsheetPageLoader {
  constructor(
    private resourceTableService: LabResourceTableService,
    private resourceId: string,
    private viewConfig: RvViewConfig
  ) {}

  loadRows(fromRow: number): Observable<SpSpreadsheetPage> {
    return this.resourceTableService
      .callNextPage(this.resourceId, this.viewConfig.methodName, this.viewConfig.configValues, fromRow)
      .pipe(map((view) => this.convertToSpSpreadPaginationResult(view)));
  }

  loadPreviousRows(toRow: number): Observable<SpSpreadsheetPage> {
    return this.resourceTableService
      .callPreviousPage(this.resourceId, this.viewConfig.methodName, this.viewConfig.configValues, toRow)
      .pipe(map((view) => this.convertToSpSpreadPaginationResult(view)));
  }

  private convertToSpSpreadPaginationResult(tableView: RvResourceViewTable): SpSpreadsheetPage {
    return {
      data: tableView.data.table,
      rows: tableView.data.rows,
    };
  }
}
