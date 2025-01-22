import {
  RvConfigValues,
  rvDefaultViewTypeInfos,
  RvResourceViewModuleConfig,
  RvResourceViewTable,
  RvResourceViewText,
  RvResourceViewTypeInfo,
  RvSpreadsheetViewConfig,
  RvTextViewConfig,
  RvViewConfig,
} from '@monorepo/resource-view';
import { SpSheetChartConfig, SpSpreadsheetPage, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { Observable } from 'rxjs';
import { LabResourceRichTextViewComponent } from '../../lab-core/entity-module/lab-resource-core/component/lab-resource-rich-text-view/lab-resource-rich-text-view.component';
import { LabShareService } from '../../lab-core/entity-service/lab-share.service';
import { LabResourceTableService } from '../../lab-core/entity-service/lab-resource-table.service';
import { map } from 'rxjs/operators';
import { LabResourceView } from '../../lab-core/model/entities/resource/lab-resource-view.entity';

/**
 * Class to make request to lab api when loading a spreadsheet page
 */
export class LabOpenRouteResourceSpreadsheetLoader implements SpSpreadsheetPageLoader {
  constructor(
    private shareService: LabShareService,
    private viewConfig: RvViewConfig,
    private token: string
  ) {}

  loadRows(fromRow: number): Observable<SpSpreadsheetPage> {
    const viewConfig = LabResourceTableService.getViewConfigNextPage(this.viewConfig.configValues, fromRow);
    return this.shareService
      .callViewOnResource(this.token, this.viewConfig.methodName, viewConfig)
      .pipe(map((view) => this.convertToSpSpreadPaginationResult(view)));
  }

  loadPreviousRows(toRow: number): Observable<SpSpreadsheetPage> {
    const viewConfig = LabResourceTableService.getViewConfigPreviousPage(this.viewConfig.configValues, toRow);
    return this.shareService
      .callViewOnResource(this.token, this.viewConfig.methodName, viewConfig)
      .pipe(map((view) => this.convertToSpSpreadPaginationResult(view)));
  }

  private convertToSpSpreadPaginationResult(view: LabResourceView): SpSpreadsheetPage {
    const tableView: RvResourceViewTable = view.view as RvResourceViewTable;
    return {
      data: tableView.data.table,
      rows: tableView.data.rows,
    };
  }
}

export class LabOpenRouteSpreadsheetViewConfig extends RvSpreadsheetViewConfig {
  constructor(
    private shareService: LabShareService,
    private token: string
  ) {
    super();
  }

  getChartConfig(): SpSheetChartConfig[] | null {
    return null;
  }

  getPagination(view: RvResourceViewTable, _: string, config: RvViewConfig): SpSpreadsheetPageLoader | null {
    // activate the pagination only for the table-view
    if (view.type === 'table-view') {
      return new LabOpenRouteResourceSpreadsheetLoader(this.shareService, config, this.token);
    } else {
      return null;
    }
  }
}

export class LabTextViewConfig extends RvTextViewConfig {
  constructor(
    private shareService: LabShareService,
    private token: string
  ) {
    super();
  }

  paginationIsEnabled(): boolean {
    return true;
  }

  callPagination(
    viewConfig: RvConfigValues,
    _: string,
    config: RvViewConfig
  ): Observable<RvResourceViewText> {
    return this.shareService
      .callViewOnResource(this.token, config.methodName, viewConfig)
      .pipe(map((view) => view.view as RvResourceViewText));
  }
}

/**
 * Configuration for the resource view module for the lab open route when using
 * a share link
 */
export class LabOpenRouteResourceViewModuleConfig extends RvResourceViewModuleConfig {
  constructor(
    private shareService: LabShareService,
    private token: string
  ) {
    super();
  }

  getAvailableViews(): Record<string, RvResourceViewTypeInfo> {
    return {
      ...rvDefaultViewTypeInfos,
      // disable the list and folder view because they require api calls
      // view: {
      //   viewComponent: null,
      // },
      // 'resources-list-view': {
      //   viewComponent: LabResourceViewListComponent,
      // },
      // 'folder-view': {
      //   viewComponent: LabResourceViewFolderComponent,
      // },
      'rich-text-view': {
        viewComponent: LabResourceRichTextViewComponent,
      },
    };
  }

  getSpreadsheetViewConfig(): RvSpreadsheetViewConfig {
    return new LabOpenRouteSpreadsheetViewConfig(this.shareService, this.token);
  }

  getTextViewConfig(): RvTextViewConfig {
    return new LabTextViewConfig(this.shareService, this.token);
  }
}
