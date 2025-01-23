import { ChChartConfig, ChChartRightSectionConfig } from '../ch-chart-config.class';
import { ChChartContainer, ChChartContainer2Axis } from '../drawer/ch-chart-container.class';
import { ChChartSVGLegend } from '../legend/ch-chart-legend.class';
import { ChChart2dBrushX, ChChartBrush } from '../drawer/ch-chart-brush.class';
import { ChChartScaleColorMulti } from '../scale/ch-chart-scale-color.class';
import { ChChartMultiSerie } from '../data/ch-chart-multi-serie.class';
import { ChChartBoxPlotData } from '../data/ch-chart-box-plot-data.class';
import { ChChartLegendMultiSeries } from '../legend/ch-chart-legend-multi-series.class';
import { ChChartScaleBand, ChChartScaleLinear, ChChartScaleNumber } from '../scale/ch-chart-scale.class';
import { ChChartAxis, ChChartAxisBand } from '../drawer/ch-chart-axis.class';
import { ChChartDomain } from '../ch-chart-domain.class';
import { ChChartRendererBoxPlot } from '../../renderer/ch-chart-renderer-box.plot';
import {
  ChChartLegendSeriesWithTagsComponent,
  ChChartLegendSerieWithTagsInput,
} from '../../component/ch-chart-right-section/ch-chart-legend-series-with-tags/ch-chart-legend-series-with-tags.component';
import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';
import { FlTagColorer } from '@monorepo/front-core-lib/fl-tag';

// Config box plot
export class ChChartBoxPlot extends ChChartConfig {
  protected readonly seriesColorScale: ChChartScaleColorMulti;
  private readonly tagColorer: FlTagColorer;

  constructor(protected dataContainer: ChChartMultiSerie<ChChartBoxPlotData>) {
    super();
    this.seriesColorScale = ChChartScaleColorMulti.fromMultiSeries(dataContainer);
    this.tagColorer = FlTagColorer.fromGroupedTags(
      this.dataContainer.getTagsGroupByKey(),
      FlColorHelper.getColorList()
    );
  }

  getChartContainer(): ChChartContainer<any> {
    const chartContainer: ChChartContainer2Axis<ChChartMultiSerie<any>> = new ChChartContainer2Axis();

    // build the x-axis and scale based on ScaleBand
    // the x domain is an array of the number of series with index of the serie
    const xScale: ChChartScaleBand = new ChChartScaleBand()
      .setInitialDomain(this.dataContainer.getBiggestSerieDomainCompleteIndexes())
      .paddingOuter(0.3);
    const xAxis: ChChartAxis = new ChChartAxisBand('bottom')
      .setScale(xScale)
      .rotateTickText()
      .setSmartTickFormat(ChChartAxisBand.tickXRotateWidth, this.dataContainer.axisXLabelTicksFormatter)
      .setLabel(this.dataContainer.axisXLabel);

    const data = this.dataContainer.getData();
    const numberData: number[] = [];
    for (const d of data) {
      numberData.push(d.min, d.lowerWhisker, d.max, d.upperWhisker);
    }
    // build the y-axis and scale linear
    const yScale: ChChartScaleLinear = new ChChartScaleNumber().setInitialDomain(
      ChChartDomain.getLinearDomain(numberData, 0, 0)
    );
    const yAxis: ChChartAxis = new ChChartAxis('left')
      .setScale(yScale)
      .setLabel(this.dataContainer.axisYLabel);

    return chartContainer
      .initXAxis(xAxis)
      .initAxisY(yAxis)
      .addRenderer(
        new ChChartRendererBoxPlot(this.seriesColorScale.exportToColorSeriesFunction(), this.tagColorer)
      )
      .initData(this.dataContainer);
  }

  getSVGLegend(): ChChartSVGLegend {
    return new ChChartLegendMultiSeries(this.dataContainer.series, this.seriesColorScale);
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    const data: ChChartLegendSerieWithTagsInput = {
      series: this.dataContainer.series,
      seriesColorScale: this.seriesColorScale,
      tagColorer: this.tagColorer,
    };

    return {
      componentType: ChChartLegendSeriesWithTagsComponent,
      data: data,
    };
  }

  getZoomBrush(): ChChartBrush {
    return new ChChart2dBrushX();
  }

  destroy(): void {
    this.tagColorer.destroy();
  }
}
