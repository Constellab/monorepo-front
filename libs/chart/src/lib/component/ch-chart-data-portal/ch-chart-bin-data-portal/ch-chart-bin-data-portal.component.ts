import {Component, Inject} from '@angular/core';
import {Numeric} from 'd3';
import {ChChartDataWithSerie} from '../../../model/data/ch-chart-serie.class';
import {ChChartDataBin} from '../../../model/data/ch-chart-data-bin.class';
import {FL_PORTAL_DATA} from '@monorepo/front-core-lib';

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
  styleUrls: ['./ch-chart-bin-data-portal.component.scss']
})
export class ChChartBinDataPortalComponent {

  y: Numeric;
  intervalText: string;

  serieName: string;
  serieKey: number;
  color: string;

  constructor(@Inject(FL_PORTAL_DATA) private input: ChChartBinDataPortalInput) {
    const bin = input.data.data;
    this.y = bin.getY();
    this.intervalText = bin.getIntervalText();
    this.serieName = input.data.serieName;
    this.serieKey = input.data.serieKey;
    this.color = input.color;
  }

}
