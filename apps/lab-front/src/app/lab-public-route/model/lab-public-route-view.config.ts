import { LiResourceRichTextViewComponent } from '@monorepo/lab-lib/li-resource';
import {
  LiResourceTableService,
  LiResourceView,
  LiShareLinkPublicAuth,
  LiShareService,
} from '@monorepo/lab-lib/li-core';
import { Observable } from 'rxjs';
import {
  RvConfigValues,
  RvResourceViewModuleConfig,
  RvResourceViewTable,
  RvResourceViewText,
  RvResourceViewTypeInfo,
  RvSpreadsheetViewConfig,
  RvTextViewConfig,
  RvViewConfig,
  rvDefaultViewTypeInfos,
} from '@monorepo/resource-view';
import { SpSheetChartConfig, SpSpreadsheetPage, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { map } from 'rxjs/operators';

/**
 * Class to make request to lab api when loading a spreadsheet page
 */
export class LabOpenRouteResourceSpreadsheetLoader implements SpSpreadsheetPageLoader {
  constructor(
    private shareService: LiShareService,
    private viewConfig: RvViewConfig,
    private auth: LiShareLinkPublicAuth
  ) {}

  loadRows(fromRow: number): Observable<SpSpreadsheetPage> {
    const viewConfig = LiResourceTableService.getViewConfigNextPage(this.viewConfig.configValues, fromRow);
    return this.shareService
      .callViewOnResource(this.auth, this.viewConfig.methodName, viewConfig)
      .pipe(map((view) => this.convertToSpSpreadPaginationResult(view)));
  }

  loadPreviousRows(toRow: number): Observable<SpSpreadsheetPage> {
    const viewConfig = LiResourceTableService.getViewConfigPreviousPage(this.viewConfig.configValues, toRow);
    return this.shareService
      .callViewOnResource(this.auth, this.viewConfig.methodName, viewConfig)
      .pipe(map((view) => this.convertToSpSpreadPaginationResult(view)));
  }

  private convertToSpSpreadPaginationResult(view: LiResourceView): SpSpreadsheetPage {
    const tableView: RvResourceViewTable = view.view as RvResourceViewTable;
    return {
      data: tableView.data.table,
      rows: tableView.data.rows,
    };
  }
}

export class LabOpenRouteSpreadsheetViewConfig extends RvSpreadsheetViewConfig {
  constructor(
    private shareService: LiShareService,
    private auth: LiShareLinkPublicAuth
  ) {
    super();
  }

  getChartConfig(): SpSheetChartConfig[] | null {
    return null;
  }

  getPagination(view: RvResourceViewTable, _: string, config: RvViewConfig): SpSpreadsheetPageLoader | null {
    // activate the pagination only for the table-view
    if (view.type === 'table-view') {
      return new LabOpenRouteResourceSpreadsheetLoader(this.shareService, config, this.auth);
    } else {
      return null;
    }
  }
}

export class LiTextViewConfig extends RvTextViewConfig {
  constructor(
    private shareService: LiShareService,
    private auth: LiShareLinkPublicAuth
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
      .callViewOnResource(this.auth, config.methodName, viewConfig)
      .pipe(map((view) => view.view as RvResourceViewText));
  }
}

/**
 * Configuration for the resource view module for the lab open route when using
 * a share link
 */
export class LabOpenRouteResourceViewModuleConfig extends RvResourceViewModuleConfig {
  constructor(
    private shareService: LiShareService,
    private auth: LiShareLinkPublicAuth
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
      //   viewComponent: LiResourceViewListComponent,
      // },
      // 'folder-view': {
      //   viewComponent: LiResourceViewFolderComponent,
      // },
      'rich-text-view': {
        viewComponent: LiResourceRichTextViewComponent,
      },
    };
  }

  getSpreadsheetViewConfig(): RvSpreadsheetViewConfig {
    return new LabOpenRouteSpreadsheetViewConfig(this.shareService, this.auth);
  }

  getTextViewConfig(): RvTextViewConfig {
    return new LiTextViewConfig(this.shareService, this.auth);
  }

  /**
   * If true the query params can be read by the view (useful for public routes for dashboards)
   */
  enableQueryParams(): boolean {
    return true;
  }
}
