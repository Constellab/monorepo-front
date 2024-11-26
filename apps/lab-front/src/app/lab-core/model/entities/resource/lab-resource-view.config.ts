// Record of view type, icon
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
import { LabResourceViewListComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-view-list/lab-resource-view-list.component';
import { LabResourceViewFolderComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-view-folder/lab-resource-view-folder.component';
import { LabResourceRichTextViewComponent } from '../../../entity-module/lab-resource-core/component/lab-resource-rich-text-view/lab-resource-rich-text-view.component';
import { SpSheetChartConfig, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { inject, Injectable, ViewContainerRef } from '@angular/core';
import { FlPortalService } from '@monorepo/front-core-lib';
import { LabResourceTableService } from '../../../entity-service/lab-resource-table.service';
import {
  LabTableChartConfigBarPlot,
  LabTableChartConfigBoxPlot,
  LabTableChartConfigHeatMap,
  LabTableChartConfigHistogram,
  LabTableChartConfigLinePlot,
  LabTableChartConfigScatterPlot,
  LabTableChartConfigStackedBarPlot,
  LabTableChartConfigVennDiagram,
  LabTableChartConfigVulcanoPlot,
} from '../../../entity-module/lab-resource-core/model/lab-table-chart-config.class';
import { LabResourceSpreadsheetPageLoader } from '../../../entity-module/lab-resource-core/model/lab-resource-spreadsheet-page-loader.class';
import { LabResourceService } from '../../../entity-service/lab-resource.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LabSpreadsheetViewConfig extends RvSpreadsheetViewConfig {
  private portalService = inject(FlPortalService);

  private resourceTableService = inject(LabResourceTableService);

  getChartConfig(
    resourceId: string,
    config: RvViewConfig,
    viewContainerRef: ViewContainerRef
  ): SpSheetChartConfig[] | null {
    return [
      new LabTableChartConfigLinePlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigScatterPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigVulcanoPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigBarPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigStackedBarPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigHistogram(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigBoxPlot(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigHeatMap(
        resourceId,
        config.methodName,
        config.configValues,
        this.resourceTableService,
        this.portalService,
        viewContainerRef
      ),
      new LabTableChartConfigVennDiagram(
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
      return new LabResourceSpreadsheetPageLoader(this.resourceTableService, resourceId, config);
    } else {
      return null;
    }
  }
}

@Injectable({
  providedIn: 'root',
})
export class LabTextViewConfig extends RvTextViewConfig {
  private resourceService = inject(LabResourceService);

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
      ...rvDefaultViewTypeInfos,
      view: {
        viewComponent: null,
      },
      'resources-list-view': {
        viewComponent: LabResourceViewListComponent,
      },
      'folder-view': {
        viewComponent: LabResourceViewFolderComponent,
      },
      'rich-text-view': {
        viewComponent: LabResourceRichTextViewComponent,
      },
    };
  }

  getSpreadsheetViewConfig(): RvSpreadsheetViewConfig {
    return this.spreadsheetViewConfig;
  }

  getTextViewConfig(): RvTextViewConfig {
    return this.textViewConfig;
  }
}
