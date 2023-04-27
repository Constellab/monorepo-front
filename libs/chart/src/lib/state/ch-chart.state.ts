import {Injectable} from '@angular/core';
import {ChChartSvg} from '../model/drawer/ch-chart-svg.class';
import {ChChartContainer, ChChartContainer2Axis} from '../model/drawer/ch-chart-container.class';
import {ChChartConfig} from '../model/ch-chart-config.class';
import {ChChartBrush} from '../model/drawer/ch-chart-brush.class';
import {FlThemeService} from '@monorepo/front-core-lib';


@Injectable()
export class ChChartState {

  public chartSVG: ChChartSvg;
  public chart: ChChartConfig;

  public chartContainer: ChChartContainer<any>;
  public zoomBrush?: ChChartBrush;

  constructor(private themeService: FlThemeService) {
  }

  public initData(chart: ChChartConfig): void {
    this.chart = chart;
  }

  public initChart(container: HTMLElement, containerWidth: number, containerHeight: number): void {
    this.chartSVG = new ChChartSvg();
    this.renderChart(container, containerWidth, containerHeight);
  }

  private renderChart(container: HTMLElement, containerWidth: number, containerHeight: number): void {
    this.chartContainer = this.chart.getChartContainer();

    const rendererConfigSize = this.chart.sizeConfig;
    // if the chart container has a size defined, use it to set the SVG size
    if (rendererConfigSize.type === 'fixed') {
      this.chartContainer.setChartRendererSize(rendererConfigSize.width, rendererConfigSize.height);
      this.chartSVG.setSVGSize(this.chartContainer.groupWidth, this.chartContainer.groupHeight);
    } else {
      // otherwise, use the HTMLElement size
      this.chartSVG.setSVGSize(containerWidth, containerHeight);
      this.chartContainer.setGroupSize(this.chartSVG.chartContainerWidth, this.chartSVG.chartContainerHeight);
    }
    this.chartSVG.initSvg(container);

    // draw the chart container
    this.chartContainer.drawChartContainer(this.chartSVG.chartContainer);

    // init brush before rendering the charts, so it does not prevent the hover on renderer
    this.zoomBrush = this.chart.getZoomBrush();
    if (this.zoomBrush) {
      this.zoomBrush.initBrush(this.chartContainer as ChChartContainer2Axis<any>);
    }

    // render the chart
    this.chartContainer.firstChartRendering();
  }


  public downloadSVG(): void {
    const svgLegend = this.chart.getSVGLegend();
    this.chartSVG.downloadSVG(svgLegend, this.themeService.isDarkTheme());
  }

  public resetZoom(): void {
    if (this.zoomBrush) {
      (this.chartContainer as ChChartContainer2Axis<any>).resetZoom();
    }
  }
}
