import { Component, Input } from '@angular/core';

import { ChChartSerieSimple } from '../../../model/data/ch-chart-serie.class';
import { ChChartScaleColor } from '../../../model/scale/ch-chart-scale-color.class';
import { ChChartRightSectionDirective } from '../ch-chart-right-section.directive';

export interface ChChartLegendMultiSeriesInput {
  series: ChChartSerieSimple[];
  seriesColorScale: ChChartScaleColor;
}

/**
 * Component to display legend for multi series chart
 */
@Component({
  selector: 'ch-chart-legend-multi-series',
  templateUrl: './ch-chart-legend-multi-series.component.html',
  styleUrls: ['./ch-chart-legend-multi-series.component.scss'],
  standalone: false,
})
export class ChChartLegendMultiSeriesComponent extends ChChartRightSectionDirective<
  ChChartLegendMultiSeriesInput
> {
  // when disable the color is replace with a grey color
  @Input() disableLegends: boolean = false;
}
