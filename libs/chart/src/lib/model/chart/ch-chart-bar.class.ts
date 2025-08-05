import {
  ChChartLegendMultiSeriesComponent,
  ChChartLegendMultiSeriesInput,
} from '../../component/ch-chart-right-section/ch-chart-legend-multi-series/ch-chart-legend-multi-series.component';
import { ChChart2AxisRenderer } from '../../renderer/ch-chart-renderer.class';
import { ChChartRendererBarPlot } from '../../renderer/ch-chart-renderer-bar.plot';
import { ChChartRendererStackedBarPlot } from '../../renderer/ch-chart-renderer-stacked-bar.plot';
import { ChChartConfig, ChChartRightSectionConfig } from '../ch-chart-config.class';
import { ChChart2dMultiSerie } from '../data/ch-chart-multi-serie.class';
import { ChChartAxis, ChChartAxisBand } from '../drawer/ch-chart-axis.class';
import { ChChart2dBrushX, ChChartBrush } from '../drawer/ch-chart-brush.class';
import { ChChartContainer, ChChartContainer2Axis } from '../drawer/ch-chart-container.class';
import { ChChartSVGLegend } from '../legend/ch-chart-legend.class';
import { ChChartLegendMultiSeries } from '../legend/ch-chart-legend-multi-series.class';
import { ChChartScaleBand, ChChartScaleLinear, ChChartScaleNumber } from '../scale/ch-chart-scale.class';
import { ChChartScaleColor, ChChartScaleColorMulti } from '../scale/ch-chart-scale-color.class';

abstract class ChChartBar extends ChChartConfig {
  protected readonly seriesColorScale: ChChartScaleColor;

  constructor(protected dataContainer: ChChart2dMultiSerie<any>) {
    super();
    this.seriesColorScale = ChChartScaleColorMulti.fromMultiSeries(dataContainer);
  }

  getChartContainer(): ChChartContainer<any> {
    const chartContainer: ChChartContainer2Axis<ChChart2dMultiSerie<any>> = new ChChartContainer2Axis();
    // build the x-axis and scale based on ScaleBand
    const xScale: ChChartScaleBand = new ChChartScaleBand().setInitialDomain(
      this.dataContainer.getDomainXComplete()
    );
    const xAxis: ChChartAxisBand = new ChChartAxisBand('bottom')
      .setScale(xScale)
      .rotateTickText()
      .setSmartTickFormat(ChChartAxisBand.tickXRotateWidth, this.dataContainer.axisXLabelTicksFormatter)
      .setLabel(this.dataContainer.axisXLabel);

    // build the y-axis and scale linear
    const yScale: ChChartScaleLinear = new ChChartScaleNumber().setInitialDomain(this.getYDomain());
    const yAxis: ChChartAxis = new ChChartAxis('left')
      .setScale(yScale)
      .setLabel(this.dataContainer.axisYLabel);

    return chartContainer
      .initXAxis(xAxis)
      .initAxisY(yAxis)
      .addRenderer(this.getRenderers())
      .initData(this.dataContainer);
  }

  getSVGLegend(): ChChartSVGLegend {
    return new ChChartLegendMultiSeries(this.dataContainer.series, this.seriesColorScale);
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    const data: ChChartLegendMultiSeriesInput = {
      series: this.dataContainer.series,
      seriesColorScale: this.seriesColorScale,
    };
    return {
      componentType: ChChartLegendMultiSeriesComponent,
      data: data,
    };
  }

  getZoomBrush(): ChChartBrush {
    return new ChChart2dBrushX();
  }

  protected abstract getRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[];

  protected abstract getYDomain(): number[];

  destroy(): void {}
}

export class ChChartBarPlot extends ChChartBar {
  protected getRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[] {
    return [new ChChartRendererBarPlot(this.seriesColorScale)];
  }

  protected getYDomain(): number[] {
    return this.dataContainer.getDomainYLinear(0, 0);
  }
}

export class ChChartHistogram extends ChChartBar {
  protected getRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[] {
    return [new ChChartRendererBarPlot(this.seriesColorScale)];
  }

  protected getYDomain(): number[] {
    return this.dataContainer.getDomainYLinear(0, 0);
  }
}

export class ChChartStackedBar extends ChChartBar {
  protected getRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[] {
    return [new ChChartRendererStackedBarPlot(this.seriesColorScale)];
  }

  protected getYDomain(): number[] {
    return this.dataContainer.getDomainYStacked(0, 0);
  }
}
