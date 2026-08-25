import {
  ChChartLegendMultiSeriesComponent,
  ChChartLegendMultiSeriesInput,
} from '../../component/ch-chart-right-section/ch-chart-legend-multi-series/ch-chart-legend-multi-series.component';
import { ChChartRendererVennDiagram } from '../../renderer/ch-chart-renderer-venn-diagram.plot';
import { ChChartConfig, ChChartRightSectionConfig } from '../ch-chart-config.class';
import { ChChartSerieSimple } from '../data/ch-chart-serie.class';
import { ChChartVennData } from '../data/ch-chart-venn-data.class';
import { ChChartBrush } from '../drawer/ch-chart-brush.class';
import { ChChartContainer, ChChartContainerNoAxis } from '../drawer/ch-chart-container.class';
import { ChChartSVGLegend } from '../legend/ch-chart-legend.class';
import { ChChartLegendMultiSeries, ChLegend } from '../legend/ch-chart-legend-multi-series.class';
import { ChChartScaleColor, ChChartScaleColorMulti } from '../scale/ch-chart-scale-color.class';

export class ChChartVennDiagram extends ChChartConfig {
  private readonly colorScale: ChChartScaleColor;

  constructor(protected readonly dataContainer: ChChartVennData) {
    super();
    this.colorScale = new ChChartScaleColorMulti(dataContainer.groupNames);
  }

  getChartContainer(): ChChartContainer<any> {
    const chartContainer: ChChartContainerNoAxis<ChChartVennData> = new ChChartContainerNoAxis();

    const colorScale: ChChartScaleColor = new ChChartScaleColorMulti(this.dataContainer.groupNames);

    return chartContainer
      .addRenderer(new ChChartRendererVennDiagram(colorScale))
      .initData(this.dataContainer);
  }

  getSVGLegend(): ChChartSVGLegend {
    // create the legend object where key = name = groupName
    const legends: ChLegend[] = this.dataContainer.groupNames.map((groupName) => ({
      name: groupName,
      key: groupName,
    }));
    return new ChChartLegendMultiSeries(legends, this.colorScale);
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    const series: ChChartSerieSimple[] = this.dataContainer.groupNames.map((groupName) => ({
      name: groupName,
      key: groupName,
      color: this.colorScale.scale(groupName),
    }));
    const data: ChChartLegendMultiSeriesInput = {
      series: series,
      seriesColorScale: this.colorScale,
    };
    return {
      componentType: ChChartLegendMultiSeriesComponent,
      data: data,
    };
  }

  // no zoom
  getZoomBrush(): ChChartBrush | undefined {
    return undefined;
  }

  destroy(): void {}
}
