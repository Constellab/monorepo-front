import {ChChartColorFunction, ChChartScaleColorMulti} from '../scale/ch-chart-scale-color.class';
import {ChChart2dMultiSerie} from '../data/ch-chart-multi-serie.class';
import {ChChartContainer, ChChartContainer2Axis} from '../drawer/ch-chart-container.class';
import {ChChartScaleLinear, ChChartScaleNumber} from '../scale/ch-chart-scale.class';
import {ChChartAxis} from '../drawer/ch-chart-axis.class';
import {ChChartSVGLegend} from '../legend/ch-chart-legend.class';
import {ChChartLegendMultiSeries} from '../legend/ch-chart-legend-multi-series.class';
import {ChChart2dBrush, ChChartBrush} from '../drawer/ch-chart-brush.class';
import {ChChart2AxisRenderer} from '../../renderer/ch-chart-renderer.class';
import {ChChartRendererLinePlot} from '../../renderer/ch-chart-renderer-line.plot';
import {ChChartRendererScatterPlot} from '../../renderer/ch-chart-renderer-scatter.plot';
import {ChChartConfig, ChChartRightSectionConfig} from '../ch-chart-config.class';
import {
  ChChartLegendMultiSeriesComponent,
  ChChartLegendMultiSeriesInput
} from '../../component/ch-chart-right-section/ch-chart-legend-multi-series/ch-chart-legend-multi-series.component';
import {ChChart2dDatum} from '../data/ch-chart-data.class';
import {
  ChChartLegendSeriesWithTagsComponent,
  ChChartLegendSerieWithTagsInput
} from '../../component/ch-chart-right-section/ch-chart-legend-series-with-tags/ch-chart-legend-series-with-tags.component';
import {ChChartDataWithSerie} from '../data/ch-chart-serie.class';
import {FlColorHelper, FlTagColorer} from '@monorepo/front-core-lib';

// abstract class to build line or scatter plot
export abstract class ChChartLinear2d extends ChChartConfig {

  protected readonly seriesColorScale: ChChartScaleColorMulti;

  protected readonly tagColorer: FlTagColorer;

  constructor(protected dataContainer: ChChart2dMultiSerie<ChChart2dDatum>) {
    super();
    this.seriesColorScale = ChChartScaleColorMulti.fromMultiSeries(dataContainer, true);

    // init tag colorer
    this.tagColorer = FlTagColorer.fromGroupedTags(this.dataContainer.getTagsGroupByKey(),
      FlColorHelper.getColorList(0.8));
  }

  getChartContainer(): ChChartContainer<any> {
    const chartContainer: ChChartContainer2Axis<ChChart2dMultiSerie<any>> = new ChChartContainer2Axis();

    // Build X axis
    const xScale: ChChartScaleLinear = new ChChartScaleNumber()
      .setInitialDomain(this.dataContainer.getDomainXLinear(this.getExtendDomain()));
    const xAxis: ChChartAxis = new ChChartAxis('bottom').setScale(xScale)
      .rotateTickText()
      .setTickFormatter(this.dataContainer.axisXLabelTicksFormatter)
      .setLabel(this.dataContainer.axisXLabel);

    // Build Y axis
    const yScale: ChChartScaleLinear = new ChChartScaleNumber()
      .setInitialDomain(this.dataContainer.getDomainYLinear(this.getExtendDomain()));
    const yAxis: ChChartAxis = new ChChartAxis('left').setScale(yScale)
      .setLabel(this.dataContainer.axisYLabel);

    chartContainer
      .initXAxis(xAxis)
      .initAxisY(yAxis)
      .addRenderer(this.createRenderers())
      .initData(this.dataContainer);

    return chartContainer;
  }

  getSVGLegend(): ChChartSVGLegend {
    return new ChChartLegendMultiSeries(this.dataContainer.series, this.seriesColorScale);
  }


  getZoomBrush(): ChChartBrush {
    return new ChChart2dBrush();
  }

  protected abstract createRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[];

  protected abstract getExtendDomain(): number;

  protected getSeriesColorFunction(): ChChartColorFunction<ChChartDataWithSerie<ChChart2dDatum>> {
    return this.seriesColorScale.exportToColorSeriesFunction();
  }

  destroy(): void {
    this.tagColorer.destroy();
  }
}

export class ChChartLine2d extends ChChartLinear2d {

  createRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[] {
    return [new ChChartRendererLinePlot(this.seriesColorScale),
      new ChChartRendererScatterPlot(this.getSeriesColorFunction(), this.tagColorer, 1.5)];
  }

  protected getExtendDomain(): number {
    return 0.5;
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    const data: ChChartLegendMultiSeriesInput = {
      series: this.dataContainer.series,
      seriesColorScale: this.seriesColorScale
    };
    return {
      componentType: ChChartLegendMultiSeriesComponent,
      data: data
    };
  }
}

export class ChChartScatterPlot2d extends ChChartLinear2d {

  createRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[] {
    return [new ChChartRendererScatterPlot(this.getSeriesColorFunction(), this.tagColorer)];
  }

  protected getExtendDomain(): number {
    return 0.5;
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    const data: ChChartLegendSerieWithTagsInput = {
      series: this.dataContainer.series,
      seriesColorScale: this.seriesColorScale,
      tagColorer: this.tagColorer
    };
    return {
      componentType: ChChartLegendSeriesWithTagsComponent,
      data: data
    };
  }
}
