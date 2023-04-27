import {ChChart2AxisRenderer} from './ch-chart-renderer.class';
import {select} from 'd3';
import {ChChartDataWithSerie} from '../model/data/ch-chart-serie.class';
import {ChChart2dDatum} from '../model/data/ch-chart-data.class';
import {ChChartScale, ChChartScaleBand} from '../model/scale/ch-chart-scale.class';
import {ChChart2dMultiSerie} from '../model/data/ch-chart-multi-serie.class';
import {ChChartDataBin} from '../model/data/ch-chart-data-bin.class';
import {
  ChChartBinDataPortalComponent,
  ChChartBinDataPortalInput
} from '../component/ch-chart-data-portal/ch-chart-bin-data-portal/ch-chart-bin-data-portal.component';
import {ChChartScaleColor} from '../model/scale/ch-chart-scale-color.class';
import {ChChartPortalHandler} from '../model/portal-handler/ch-chart-portal-handler.class';
import {
  ChChartDataWithSeriePortalInput
} from '../component/ch-chart-data-portal/ch-chart-data-with-serie-portal/ch-chart-data-with-serie-portal.component';


/**
 * Renderer for bar plot or histogram
 */
export class ChChartRendererBarPlot extends ChChart2AxisRenderer<ChChart2dMultiSerie<ChChart2dDatum>> {

  private readonly groupClassName: string = 'serie';

  private portalHandler: ChChartPortalHandler = new ChChartPortalHandler();

  constructor(private colorScale: ChChartScaleColor) {
    super();
  }

  renderFirst(): void {
    this.refreshRender();
  }


  refreshRender(): void {
    const chartData: ChChartDataWithSerie<ChChart2dDatum>[][] = this.data.data.groupByX();

    this.data.container
      // generate a group for each serie
      .selectAll(`.${this.groupClassName}`)
      .data(chartData)
      .join('g')
      .attr('class', this.groupClassName)  // I add the class line to be able to modify this line later on.
      .attr('transform', (d) =>
        this.getGroupTranslate(this.data.xAxis.scale, this.data.chartWidth, d))

      // for each group generate the values
      .each((data, index, nodes) =>
        this.drawSerie(nodes[index] as any, data, (this.data.xAxis.scale as ChChartScaleBand).bandwidth()));
  }

  private drawSerie(group: SVGElement, chartData: ChChartDataWithSerie<ChChart2dDatum>[],
                    groupWidth: number): void {

    const barWidth: number = groupWidth / chartData.length;

    select(group).selectAll('rect')
      .data(chartData)
      .join('rect')
      .on('mouseover', (event, d) => this.openPortal(event, d, false))
      .on('mouseout', () => this.closePortal())
      .on('click', (event, d) => this.openPortal(event, d, true))
      .style('fill', (d) => this.colorScale.scale(d.serieKey))
      .each((d, index, nodes: SVGRectElement[]) =>
        this.drawBar(d, nodes[index], barWidth, this.data.yAxis.scale, index));
  }


  // return the position of the group
  private getGroupTranslate(xScale: ChChartScale, chartWidth: number, d: ChChartDataWithSerie<ChChart2dDatum>[]): string {
    // get the x value (each series have the same x) and scale it
    const x = xScale.scale(d[0].data.getX());
    // if the scale return null set the group outside chart
    return 'translate(' + (x == null ? (chartWidth + 10) : x) + ',0)';
  }

  // draw one bar
  private drawBar(d: ChChartDataWithSerie<ChChart2dDatum>, element: SVGRectElement, barWidth: number,
                  yScale: ChChartScale, index: number): void {
    if (d.data == null) {
      return;
    }

    // prevent bar width from being smaller than 1
    barWidth = Math.max(barWidth, 1);

    const y0 = yScale.scale(0);

    select(element)
      .attr('transform',
        (d: ChChartDataWithSerie<ChChart2dDatum>) => this.getTransform(d, barWidth, yScale, index, y0)
      )
      .attr('width', barWidth - 0.5) // - 1 to let space between bars
      // set height, equals to distance from 0
      .attr('height', (d: ChChartDataWithSerie<ChChart2dDatum>) => Math.abs(yScale.scale(d.data.getY(0)) - y0));
  }

  private getTransform(d: ChChartDataWithSerie<ChChart2dDatum>, barWidth: number,
                       yScale: ChChartScale, index: number, y0: number): string {
    const value = d.data.getY(0);

    let y: number;
    if (value >= 0) {
      y = yScale.scale(value);
    } else {
      // if negative, the base is 0
      y = y0;
    }

    return `translate(${barWidth * index},${y})`;
  }


  private openPortal(event: MouseEvent, d: ChChartDataWithSerie<ChChart2dDatum>, fixPortal: boolean): void {
    // handle the ChChartDataBin portal
    if (d.data instanceof ChChartDataBin) {
      const data: ChChartBinDataPortalInput = {
        data: d as any,
        color: this.colorScale.scale(d.serieKey)
      };
      // create the portal
      this.portalHandler.openPortal(event.target as any, ChChartBinDataPortalComponent, data, fixPortal);

      // basic portal
    } else {
      const data: ChChartDataWithSeriePortalInput = {
        data: d,
        color: this.colorScale.scale(d.serieKey),
        xLabelFormatter: this.data.xAxis.getTickFormatter(),
        yLabelFormatter: this.data.yAxis.getTickFormatter(),
      };
      // create the portal
      this.portalHandler.openDataWithSeriePortal(event.target as any, data, fixPortal);
    }
  }


  private closePortal(): void {
    this.portalHandler.closePortal();
  }
}
