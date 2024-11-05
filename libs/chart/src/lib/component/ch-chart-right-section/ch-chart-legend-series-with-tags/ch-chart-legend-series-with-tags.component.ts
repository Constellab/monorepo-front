import { Component, OnInit } from '@angular/core';
import { ChChartSerieSimple } from '../../../model/data/ch-chart-serie.class';
import { ChChartRightSectionDirective } from '../ch-chart-right-section.directive';
import { Observable } from 'rxjs';
import { ChChartScaleColor } from '../../../model/scale/ch-chart-scale-color.class';
import { FlTagColorer, FlTagWithColor } from '@monorepo/front-core-lib';

export interface ChChartLegendSerieWithTagsInput {
  series: ChChartSerieSimple[];
  seriesColorScale: ChChartScaleColor;
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

  onTagColorChange(tags: FlTagWithColor[]): void {
    // this.data.tagColorer.setSelectedTags(tags);
    this.tagAreSelected = tags?.length > 0;
  }
}
