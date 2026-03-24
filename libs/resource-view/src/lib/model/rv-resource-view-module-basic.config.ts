import { Injectable } from '@angular/core';

import {
  RvResourceViewModuleConfig,
  RvSpreadsheetViewBasicConfig,
  RvSpreadsheetViewConfig,
  RvTextViewBasicConfig,
  RvTextViewConfig,
} from './rv-resource-view-module.config';
import { RV_DEFAULT_VIEW_TYPE_INFOS, RvResourceViewTypeInfo } from './rv-type-info.class';

/**
 * Default configuration for the ResourceViewModule (basic)
 */
@Injectable({
  providedIn: 'root',
})
export class RvResourceViewModuleBasicConfig extends RvResourceViewModuleConfig {
  // list the views that are available
  getAvailableViews(): Record<string, RvResourceViewTypeInfo> {
    return RV_DEFAULT_VIEW_TYPE_INFOS;
  }

  getSpreadsheetViewConfig(): RvSpreadsheetViewConfig {
    return new RvSpreadsheetViewBasicConfig();
  }

  getTextViewConfig(): RvTextViewConfig {
    return new RvTextViewBasicConfig();
  }
}
