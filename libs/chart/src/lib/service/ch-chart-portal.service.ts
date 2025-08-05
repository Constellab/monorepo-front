import { Injectable } from '@angular/core';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { ChChartPortalComponent } from '../component/ch-chart-portal/ch-chart-portal.component';
import { ChChartPortalConfig } from '../model/ch-chart.class';

/**
 * Service to open chart portal
 */
@Injectable()
export class ChChartPortalService extends FlPortalService {
  public createDynamicChartPortal(
    chartConfig: ChChartPortalConfig,
    portalConfig: FlPortalConfig
  ): FlOverlayRef {
    return this.createPortal(ChChartPortalComponent, portalConfig, chartConfig);
  }
}
