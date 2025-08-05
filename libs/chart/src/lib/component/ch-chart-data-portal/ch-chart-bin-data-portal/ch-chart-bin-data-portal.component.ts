import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { Numeric } from 'd3';

import { ChChartDataBin, ChChartHistogramMode } from '../../../model/data/ch-chart-data-bin.class';
import { ChChartDataWithSerie } from '../../../model/data/ch-chart-serie.class';

export interface ChChartBinDataPortalInput {
  data: ChChartDataWithSerie<ChChartDataBin>;
  color: string;
}

/**
 * Portal to display a bin data
 */
@Component({
  selector: 'ch-chart-bin-data-portal',
  templateUrl: './ch-chart-bin-data-portal.component.html',
  styleUrls: ['./ch-chart-bin-data-portal.component.scss'],
  standalone: false,
})
export class ChChartBinDataPortalComponent {
  y: Numeric;
  intervalText: string;

  serieName: string;
  serieKey: number;
  color: string;
  histogramMode: ChChartHistogramMode;

  constructor() {
    const input = inject<ChChartBinDataPortalInput>(FL_PORTAL_DATA);

    const bin = input.data.data;
    this.y = bin.getY();
    this.intervalText = bin.getIntervalLongText();
    this.serieName = input.data.serieName;
    this.serieKey = input.data.serieKey;
    this.color = input.color;
    this.histogramMode = input.data.data.mode;
  }
}
