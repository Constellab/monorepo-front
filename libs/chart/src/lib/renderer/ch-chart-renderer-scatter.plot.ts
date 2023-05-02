import {ChChart2dDatum} from '../model/data/ch-chart-data.class';
import {ChChart2AxisRendererWithColors} from './ch-chart-renderer.class';
import {ChChartDataWithSerie} from '../model/data/ch-chart-serie.class';
import {ChChart2dMultiSerie} from '../model/data/ch-chart-multi-serie.class';
import {ChChartColorFunction} from '../model/scale/ch-chart-scale-color.class';
import {
  ChChartDataWithSeriePortalInput
} from '../component/ch-chart-data-portal/ch-chart-data-with-serie-portal/ch-chart-data-with-serie-portal.component';
import {ChChartPortalHandler} from '../model/portal-handler/ch-chart-portal-handler.class';
import {FlColorHelper, FlTagColorer, FlTagWithColor} from '@monorepo/front-core-lib';

export class ChChartRendererScatterPlot extends ChChart2AxisRendererWithColors<ChChart2dMultiSerie<ChChart2dDatum>,
  ChChartDataWithSerie<ChChart2dDatum>> {

  private portalHandler: ChChartPortalHandler = new ChChartPortalHandler();

  constructor(defaultColorFunction: ChChartColorFunction<ChChartDataWithSerie<ChChart2dDatum>>,
              private tagColorer: FlTagColorer,
              private pointSize: number = 3){
    super(defaultColorFunction);
  }

  renderFirst(): void {
    // Add dots
    this.data.container
      // generate groups for the series
      .selectAll()
      .data(this.data.data.series)
      .enter()
      .append('g')

      // for each group, generate the circle
      .selectAll()
      .data((d) => d.getDataWithSerie(true))
      .enter()
      .append('circle')
      .attr('r', this.pointSize)
      .style('fill', this.currentColorFunction)
      .attr('cx', (d: ChChartDataWithSerie<ChChart2dDatum>) => this.data.xAxis.scale.scale(d.data.getX()))
      .attr('cy', (d: ChChartDataWithSerie<ChChart2dDatum>) => this.data.yAxis.scale.scale(d.data.getY()))
      .on('mouseover', (event, d) => this.onMouseHover(event, d))
      .on('mouseout', () => this.onMouseOut())
      .on('click', (event, d) => this.onMouseClick(event, d));

    this.tagColorer.getSelectedTags$().subscribe(
      tags => this.onSelectedTagUpdate(tags)
    );
  }

  refreshRender(): void {
    this.data.container
      .selectAll(`circle`)
      .transition()
      .attr('cx', (d: ChChartDataWithSerie<ChChart2dDatum>) => this.data.xAxis.scale.scale(d.data.getX()))
      .attr('cy', (d: ChChartDataWithSerie<ChChart2dDatum>) => this.data.yAxis.scale.scale(d.data.getY()));
  }

  protected refreshColor(colorFunction: ChChartColorFunction<ChChartDataWithSerie<ChChart2dDatum>>): void {
    this.data.container
      .selectAll(`circle`)
      .style('fill', colorFunction);
  }

  private onMouseClick(event: MouseEvent, d: ChChartDataWithSerie<ChChart2dDatum>): void {
    this.openPortal(event, d, true);
  }

  private onMouseHover(event: MouseEvent, d: ChChartDataWithSerie<ChChart2dDatum>): void {
    this.openPortal(event, d, false);
  }

  private openPortal(event: MouseEvent, d: ChChartDataWithSerie<ChChart2dDatum>, fixPortal: boolean): void {
    // this.data.xScale
    const data: ChChartDataWithSeriePortalInput = {
      data: d,
      color: this.currentColorFunction(d),
      tagColorer: this.tagColorer,
      xLabelFormatter: this.data.xAxis.getTickFormatter(),
      yLabelFormatter: this.data.yAxis.getTickFormatter(),
    };
    this.data.data.getDomainXComplete();
    this.portalHandler.openDataWithSeriePortal(event.target as any, data, fixPortal);
  }

  private onMouseOut(): void {
    this.portalHandler.closePortal();
  }

  private onSelectedTagUpdate(selectedTags: FlTagWithColor[]): void {
    if (selectedTags.length > 0) {
      const colorFunction: ChChartColorFunction<ChChartDataWithSerie<ChChart2dDatum>> = (d: ChChartDataWithSerie<ChChart2dDatum>) => {
        return FlTagColorer.getObjectColor(d.data.tags, selectedTags, FlColorHelper.transparentBlack);
      };
      this.setColorFunction(colorFunction);
    } else {
      this.resetColors();
    }
  }

}
