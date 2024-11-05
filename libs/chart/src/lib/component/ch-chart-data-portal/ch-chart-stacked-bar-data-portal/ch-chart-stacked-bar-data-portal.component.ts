import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ChChartDataWithSerie } from '../../../model/data/ch-chart-serie.class';
import { ChChart2dDatum } from '../../../model/data/ch-chart-data.class';
import { ChChartScaleColor } from '../../../model/scale/ch-chart-scale-color.class';
import { ChChartLabelFormatter } from '../../../model/ch-chart-label-formatter.class';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib';

export interface ChChartStackedBarDataPortalInput {
  data: ChChartDataWithSerie<ChChart2dDatum>[];
  seriesColorScale: ChChartScaleColor;
  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;
  selectedValue: ChChart2dDatum;
}

/**
 * Portal to show all the value with series of a bar.
 */
@Component({
  selector: 'ch-chart-stacked-bar-data-portal',
  templateUrl: './ch-chart-stacked-bar-data-portal.component.html',
  styleUrls: ['./ch-chart-stacked-bar-data-portal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChChartStackedBarDataPortalComponent {
  x: number;

  xLabelFormatter: ChChartLabelFormatter;
  yLabelFormatter: ChChartLabelFormatter;

  data: ChChartDataWithSerie<ChChart2dDatum>[];
  seriesColorScale: ChChartScaleColor;

  selectedValue: ChChart2dDatum;

  constructor(@Inject(FL_PORTAL_DATA) input: ChChartStackedBarDataPortalInput) {
    this.data = [...input.data].reverse();
    this.seriesColorScale = input.seriesColorScale;

    // retrieve the x, all the values have the same X as it is one stacked bar
    if (this.data?.length > 0) {
      this.x = this.data[0].data.getX();
    }
    this.xLabelFormatter = input.xLabelFormatter;
    this.yLabelFormatter = input.yLabelFormatter;
    this.selectedValue = input.selectedValue;
  }
}
