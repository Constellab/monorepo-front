import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';

import { ChChartPortalConfig } from '../../model/ch-chart.class';

@Component({
  selector: 'ch-chart-portal',
  templateUrl: './ch-chart-portal.component.html',
  styleUrls: ['./ch-chart-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChChartPortalComponent {
  config: ChChartPortalConfig;

  constructor() {
    const config = inject<ChChartPortalConfig>(FL_PORTAL_DATA);

    this.config = config;
  }
}
