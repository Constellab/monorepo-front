import { Component, inject } from '@angular/core';
import { ChChartPortalConfig } from '../../model/ch-chart.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';

@Component({
  selector: 'ch-chart-portal',
  templateUrl: './ch-chart-portal.component.html',
  styleUrls: ['./ch-chart-portal.component.scss'],
  standalone: false,
})
export class ChChartPortalComponent {
  config: ChChartPortalConfig;

  constructor() {
    const config = inject<ChChartPortalConfig>(FL_PORTAL_DATA);

    this.config = config;
  }
}
