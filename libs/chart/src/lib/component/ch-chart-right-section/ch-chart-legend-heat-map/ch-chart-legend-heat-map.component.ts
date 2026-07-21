import { ChangeDetectionStrategy,Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { select } from 'd3';

import { ChChartSVGLegend } from '../../../model/legend/ch-chart-legend.class';
import { ChChartRightSectionDirective } from '../ch-chart-right-section.directive';

/**
 * Component to render legend for heat map, it renders the legend in an svg
 */
@Component({
  selector: 'ch-chart-legend-heat-map',
  templateUrl: './ch-chart-legend-heat-map.component.html',
  styleUrls: ['./ch-chart-legend-heat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
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
