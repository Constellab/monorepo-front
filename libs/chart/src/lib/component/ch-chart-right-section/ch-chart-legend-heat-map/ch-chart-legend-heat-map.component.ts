import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChChartRightSectionDirective } from '../ch-chart-right-section.directive';
import { ChChartSVGLegend } from '../../../model/legend/ch-chart-legend.class';
import { select } from 'd3';

/**
 * Component to render legend for heat map, it renders the legend in an svg
 */
@Component({
    selector: 'ch-chart-legend-heat-map',
    templateUrl: './ch-chart-legend-heat-map.component.html',
    styleUrls: ['./ch-chart-legend-heat-map.component.scss'],
    standalone: false
})
export class ChChartLegendHeatMapComponent
  extends ChChartRightSectionDirective<ChChartSVGLegend>
  implements OnInit
{
  @ViewChild('svg', { static: true }) svg: ElementRef<HTMLElement>;

  ngOnInit(): void {
    const svgSelect = select<HTMLElement, void>(this.svg.nativeElement);
    this.data.renderLegend(
      svgSelect,
      this.svg.nativeElement.clientWidth,
      this.svg.nativeElement.clientHeight
    );
  }
}
