import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LiResourceService, LiResourceTableService } from '@monorepo/lab-lib/li-core';
import {
  LiResourceRichTextViewComponent,
  LiResourceSpreadsheetPageLoader,
  LiResourceViewFolderComponent,
  LiResourceViewListComponent,
  LiTableChartConfigBarPlot,
  LiTableChartConfigBoxPlot,
  LiTableChartConfigHeatMap,
  LiTableChartConfigHistogram,
  LiTableChartConfigLinePlot,
  LiTableChartConfigScatterPlot,
  LiTableChartConfigStackedBarPlot,
  LiTableChartConfigVennDiagram,
  LiTableChartConfigVulcanoPlot,
} from '@monorepo/lab-lib/li-resource';
import {
  RV_DEFAULT_VIEW_TYPE_INFOS,
  RvConfigValues,
  RvResourceViewModuleConfig,
  RvResourceViewTable,
  RvResourceViewText,
  RvResourceViewTypeInfo,
  RvSpreadsheetViewConfig,
  RvTextViewConfig,
  RvViewConfig,
} from '@monorepo/resource-view';
import { SpSheetChartConfig, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { Observable } from 'rxjs';

// Record of view type, icon

@Injectable({
  providedIn: 'root',
})
export class LabSpreadsheetViewConfig extends RvSpreadsheetViewConfig {
  private portalService = inject(FlPortalService);

  private resourceTableService = inject(LiResourceTableService);

  getChartConfig(
    resourceId: string,
    config: RvViewConfig,
    viewContainerRef: ViewContainerRef
  ): SpSheetChartConfig[] | null {
    return [
      new LiTableChartConfigLinePlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigScatterPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigVulcanoPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigBarPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigStackedBarPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigHistogram(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigBoxPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigHeatMap(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LiTableChartConfigVennDiagram(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
    ];
  }

  getPagination(
    view: RvResourceViewTable,
    resourceId: string,
    config: RvViewConfig
  ): SpSpreadsheetPageLoader | null {
    // activate the pagination only for the table-view
    if (view.type === 'table-view') {
      return new LiResourceSpreadsheetPageLoader(this.resourceTableService, resourceId, config);
    } else {
      return null;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class LabTextViewConfig extends RvTextViewConfig {
  private resourceService = inject(LiResourceService);

  paginationIsEnabled(): boolean {
    return true;
  }

  callPagination(
    viewConfig: RvConfigValues,
    resourceId: string,
    config: RvViewConfig
  ): Observable<RvResourceViewText> {
    return this.resourceService.callResourceViewData(
      resourceId,
      config.methodName,
      viewConfig
    ) as Observable<RvResourceViewText>;
  }
}

@Injectable({
  providedIn: 'root',
})
export class LabResourceViewModuleConfig extends RvResourceViewModuleConfig {
  private spreadsheetViewConfig = inject(LabSpreadsheetViewConfig);

  private textViewConfig = inject(LabTextViewConfig);

  getAvailableViews(): Record<string, RvResourceViewTypeInfo> {
    return {
      ...RV_DEFAULT_VIEW_TYPE_INFOS,
      view: {
        viewComponent: null,
      },
      'resources-list-view': {
        viewComponent: LiResourceViewListComponent,
      },
      'folder-view': {
        viewComponent: LiResourceViewFolderComponent,
      },
      'rich-text-view': {
        viewComponent: LiResourceRichTextViewComponent,
      },
    };
  }

  getSpreadsheetViewConfig(): RvSpreadsheetViewConfig {
    return this.spreadsheetViewConfig;
  }

  getTextViewConfig(): RvTextViewConfig {
    return this.textViewConfig;
  }

  enableQueryParams(): boolean {
    return true;
  }
}
