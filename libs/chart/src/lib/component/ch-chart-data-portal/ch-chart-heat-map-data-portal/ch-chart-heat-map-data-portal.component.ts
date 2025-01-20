import { Component, Inject } from '@angular/core';
import { ChChart3dDatum } from '../../../model/data/ch-chart-data.class';
import { ChChartLabelFormatter } from '../../../model/ch-chart-label-formatter.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';

export interface ChChartHeatMapDataPortalInput {
  data: ChChart3dDatum;
  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;
}

@Component({
    selector: 'ch-chart-heat-map-data-portal',
    templateUrl: './ch-chart-heat-map-data-portal.component.html',
    styleUrls: ['./ch-chart-heat-map-data-portal.component.scss'],
    standalone: false
})
export class ChChartHeatMapDataPortalComponent {
  data: ChChart3dDatum;

  x: number;
  y: number;
  z: number;

  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;
  zLabelFormatter: ChChartLabelFormatter = ChChartLabelFormatter.getDefaultTickLabel();

  constructor(@Inject(FL_PORTAL_DATA) input: ChChartHeatMapDataPortalInput) {
    this.data = input.data;
    this.x = input.data.getX();
    this.y = input.data.getY();
    this.z = input.data.getZ();
    this.xLabelFormatter = input.xLabelFormatter;
    this.yLabelFormatter = input.yLabelFormatter;
  }
}
