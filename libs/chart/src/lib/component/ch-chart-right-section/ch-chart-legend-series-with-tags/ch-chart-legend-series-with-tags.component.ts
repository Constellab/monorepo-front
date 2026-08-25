import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FlTagColorer, FlTagWithColor } from '@monorepo/front-core-lib/fl-tag';
import { Observable } from 'rxjs';

import { ChChartSerieSimple } from '../../../model/data/ch-chart-serie.class';
import { ChChartScaleColor } from '../../../model/scale/ch-chart-scale-color.class';
import { ChChartLegendMultiSeriesInput } from '../ch-chart-legend-multi-series/ch-chart-legend-multi-series.component';
import { ChChartRightSectionDirective } from '../ch-chart-right-section.directive';

export interface ChChartLegendSerieWithTagsInput {
  series: ChChartSerieSimple[] | null;
  seriesColorScale: ChChartScaleColor | null;
  tagColorer: FlTagColorer;
}

/**
 * Right section of the chart containing the legend (multi series) and a list of tag with selection
 * to change chart color
 */
@Component({
  selector: 'ch-chart-legend-series-with-tags',
  templateUrl: './ch-chart-legend-series-with-tags.component.html',
  styleUrls: ['./ch-chart-legend-series-with-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ChChartLegendSeriesWithTagsComponent
  extends ChChartRightSectionDirective<ChChartLegendSerieWithTagsInput>
  implements OnInit
{
  tagAreSelected: boolean = false;

  hasTag$: Observable<boolean>;

  ngOnInit(): void {
    this.hasTag$ = this.data.tagColorer.hasTags$();
  }

  /**
   * Narrowed input for ch-chart-legend-multi-series, built only when both series and
   * seriesColorScale are available (the multi-series legend requires non-null values).
   */
  get multiSeriesData(): ChChartLegendMultiSeriesInput | null {
    if (this.data.series == null || this.data.seriesColorScale == null) {
      return null;
    }
    return { series: this.data.series, seriesColorScale: this.data.seriesColorScale };
  }

  onTagColorChange(tags: FlTagWithColor[]): void {
    // this.data.tagColorer.setSelectedTags(tags);
    this.tagAreSelected = tags?.length > 0;
  }
}
