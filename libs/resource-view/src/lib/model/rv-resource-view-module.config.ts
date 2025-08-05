import { InjectionToken, ViewContainerRef } from '@angular/core';
import { SpSheetChartConfig, SpSpreadsheetPageLoader } from '@monorepo/spreadsheet';
import { Observable } from 'rxjs';

import { RvResourceViewText } from './rv-resource-view.class';
import { RvResourceViewTable } from './rv-table.class';
import { RvResourceViewTypeInfo } from './rv-type-info.class';
import { RvConfigValues, RvViewConfig } from './rv-view-config.class';

export abstract class RvSpreadsheetViewConfig {
  abstract getChartConfig(
    resourceId: string,
    config: RvViewConfig,
    viewContainerRef: ViewContainerRef
  ): SpSheetChartConfig[] | null;

  abstract getPagination(
    view: RvResourceViewTable,
    resourceId: string,
    config: RvViewConfig
  ): SpSpreadsheetPageLoader | null;
}

export abstract class RvTextViewConfig {
  abstract paginationIsEnabled(): boolean;

  abstract callPagination(
    viewConfig: RvConfigValues,
    resourceId: string,
    config: RvViewConfig
  ): Observable<RvResourceViewText>;
}

/**
 * Configuration for the ResourceViewModule
 */
export abstract class RvResourceViewModuleConfig {
  getViewTypeInfo(viewType: string): RvResourceViewTypeInfo {
    return this.getAvailableViews()[viewType];
  }

  /**
   * list the views that are available
   */
  abstract getAvailableViews(): Record<string, RvResourceViewTypeInfo>;

  /**
   * Configuration for the spreadsheet view (pagination, chart)
   */
  abstract getSpreadsheetViewConfig(): RvSpreadsheetViewConfig;

  /**
   * Configuration for the text view (pagination)
   */
  abstract getTextViewConfig(): RvTextViewConfig;

  /**
   * If true the query params can be read by the view (useful for public routes for dashboards)
   */
  enableQueryParams(): boolean {
    return false;
  }
}

export class RvSpreadsheetViewBasicConfig extends RvSpreadsheetViewConfig {
  getChartConfig(): SpSheetChartConfig[] | null {
    return null;
  }

  getPagination(): SpSpreadsheetPageLoader | null {
    return null;
  }
}

export class RvTextViewBasicConfig extends RvTextViewConfig {
  paginationIsEnabled(): boolean {
    return false;
  }

  callPagination(): Observable<RvResourceViewText> {
    return null;
  }
}

/**
 * @ignore
 * Use to inject the configuration of the ResourceViewModule
 *
 * Use '@Inject(RV_MODULE_CONFIG)' to inject it in component or service
 */
export const RV_MODULE_CONFIG = new InjectionToken<RvResourceViewModuleConfig>('RV_MODULE_CONFIG');
