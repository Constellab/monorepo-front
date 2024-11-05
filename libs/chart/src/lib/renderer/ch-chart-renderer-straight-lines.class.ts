import { ChChart2AxisRenderer } from './ch-chart-renderer.class';
import { chD3DefaultTransitionDuration } from '../model/ch-d3.class';

export interface ChChartLine {
  orientation: 'vertical' | 'horizontal';
  position: number;
}

/**
 * Renderer to render simple straight lines.
 */
export class ChChartRendererStraightLines extends ChChart2AxisRenderer<any> {
  private readonly lineClassName: string = 'simple-line';

  constructor(private lines: ChChartLine[]) {
    super();
  }

  renderFirst(): void {
    this.draw(false);
  }

  refreshRender(): void {
    this.draw(true);
  }

  private draw(withTransition: boolean): void {
    const theme = this.getTheme();
    this.data.container
      .selectAll(`.${this.lineClassName}`)
      .data(this.lines)
      .join('line')
      .attr('class', this.lineClassName)
      .transition()
      .duration(withTransition ? chD3DefaultTransitionDuration : 0)
      .attr('x1', (d) => (d.orientation === 'vertical' ? this.data.xAxis.scale.scale(d.position) : 0))
      .attr('y1', (d) => (d.orientation === 'horizontal' ? this.data.yAxis.scale.scale(d.position) : 0))
      .attr('x2', (d) =>
        d.orientation === 'vertical' ? this.data.xAxis.scale.scale(d.position) : this.data.chartWidth
      )
      .attr('y2', (d) =>
        d.orientation === 'horizontal' ? this.data.yAxis.scale.scale(d.position) : this.data.chartHeight
      )
      .attr('stroke', theme.cardBackground);
  }
}
