import { select, Series, SeriesPoint, Stack, stack } from 'd3';

import {
  ChChartStackedBarDataPortalComponent,
  ChChartStackedBarDataPortalInput,
} from '../component/ch-chart-data-portal/ch-chart-stacked-bar-data-portal/ch-chart-stacked-bar-data-portal.component';
import { ChD3SelectionSimple } from '../model/ch-d3.class';
import { ChChart2dDatum } from '../model/data/ch-chart-data.class';
import { ChChart2dMultiSerie } from '../model/data/ch-chart-multi-serie.class';
import { ChChartDataWithSerie } from '../model/data/ch-chart-serie.class';
import { ChChartPortalHandler } from '../model/portal-handler/ch-chart-portal-handler.class';
import { ChChartScaleBand } from '../model/scale/ch-chart-scale.class';
import { ChChartScaleColor } from '../model/scale/ch-chart-scale-color.class';
import { ChChart2AxisRenderer } from './ch-chart-renderer.class';

/**
 * Renderer for stack stack bar plot or histogram
 */
export class ChChartRendererStackedBarPlot extends ChChart2AxisRenderer<ChChart2dMultiSerie<ChChart2dDatum>> {
  private readonly barGroupClassName: string = 'bar-group';
  private readonly barClassName: string = 'bar';
  private portalHandler: ChChartPortalHandler = new ChChartPortalHandler();

  constructor(public colorScale: ChChartScaleColor) {
    super();
  }

  renderFirst(): void {
    this.refreshRender();
  }

  refreshRender(): void {
    const stackedData = this.getStackedData(this.data.data);

    // Show the bars
    this.data.container
      .selectAll(`.${this.barGroupClassName}`)
      // Enter in the stack data = loop key per key = group per group
      // first group is the first serie, second group the second serie
      .data(stackedData)
      .join('g')
      .attr('class', this.barGroupClassName)
      .attr('fill', (d) => this.colorScale.scale(d.key))

      .selectAll('rect')
      // enter a second time = loop subgroup per subgroup to add all rectangles
      .data((d) => d)
      .join('rect')
      .on('mouseover', (event, d) => this.onMouseHover(event, d))
      .on('click', (event, d) => this.onMouseClick(event, d))
      .on('mouseout', () => this.onMouseOut())
      .attr('class', this.barClassName)
      .each((data, index, nodes) => this.drawBars(nodes[index] as any));
  }

  private drawBars(group: SVGElement): void {
    const selection: ChD3SelectionSimple<SeriesPoint<ChChartDataWithSerie<ChChart2dDatum>[]>> = select(group);

    selection
      // use the x from the first data because there have the same X, if return undefined, set to
      // chartWidth to hide it
      .attr('x', (d) => this.data.xAxis.scale.scale(d.data[0].data.getX(), this.data.chartWidth))
      .attr('y', (d) => this.data.yAxis.scale.scale(d[1]))
      .attr('height', (d) =>
        Math.max(this.data.yAxis.scale.scale(d[0]) - this.data.yAxis.scale.scale(d[1]), 0)
      )
      .attr('width', (this.data.xAxis.scale as ChChartScaleBand).bandwidth());
  }

  private onMouseHover(event: MouseEvent, d: SeriesPoint<ChChartDataWithSerie<ChChart2dDatum>[]>): void {
    this.openPortal(event, d, false);
  }

  private onMouseClick(event: MouseEvent, d: SeriesPoint<ChChartDataWithSerie<ChChart2dDatum>[]>): void {
    this.openPortal(event, d, true);
  }

  private openPortal(
    event: MouseEvent,
    d: SeriesPoint<ChChartDataWithSerie<ChChart2dDatum>[]>,
    fixPortal: boolean
  ): void {
    // find the select bar section by using the sum of the previous data
    let sum = 0;
    let selectedValue: ChChart2dDatum | null = null;
    for (const data of d.data) {
      sum += data.data.getY();
      // when the sum of the previous data is equal than the bar top value, it is the selected value
      if (sum >= d[1]) {
        selectedValue = data.data;
        break;
      }
    }
    const data: ChChartStackedBarDataPortalInput = {
      data: d.data,
      seriesColorScale: this.colorScale,
      xLabelFormatter: this.data.xAxis.getTickFormatter(),
      yLabelFormatter: this.data.yAxis.getTickFormatter(),
      selectedValue: selectedValue,
    };

    // create the portal
    this.portalHandler.openPortal(event.target as any, ChChartStackedBarDataPortalComponent, data, fixPortal);
  }

  private onMouseOut(): void {
    this.portalHandler.closePortal();
  }

  // format of one stack data : [0] = y1; [1] = y2; .data=ChChartDataWithSerie
  private getStackedData(
    series: ChChart2dMultiSerie<ChChart2dDatum>
  ): Series<ChChartDataWithSerie<ChChart2dDatum>[], number>[] {
    const data: ChChartDataWithSerie<ChChart2dDatum>[][] = series.invert();

    const keys: number[] = data[0].map((_, i) => i);

    const stackFunction: Stack<any, ChChartDataWithSerie<ChChart2dDatum>[], number> = stack<
      any,
      any,
      number
    >();
    stackFunction
      .keys(keys)
      .value((d: ChChartDataWithSerie<ChChart2dDatum>[], key) => d[key].data.getY())
      .order();
    // build stacked data
    return stackFunction(data);
  }
}
