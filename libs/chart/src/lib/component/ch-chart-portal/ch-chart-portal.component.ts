import { Component, Inject } from '@angular/core';
import { ChChartPortalConfig } from '../../model/ch-chart.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';

@Component({
  selector: 'ch-chart-portal',
  templateUrl: './ch-chart-portal.component.html',
  styleUrls: ['./ch-chart-portal.component.scss'],
})
export class ChChartPortalComponent {
  config: ChChartPortalConfig;

  constructor(@Inject(FL_PORTAL_DATA) config: ChChartPortalConfig) {
    this.config = config;
  }
}
