import { ChChartConfig, ChChartRightSectionConfig } from '../ch-chart-config.class';
import { ChChartContainer, ChChartContainer2Axis } from '../drawer/ch-chart-container.class';
import { ChChartSVGLegend } from '../legend/ch-chart-legend.class';
import { ChChartBrush } from '../drawer/ch-chart-brush.class';
import { ChChart3dDatum, ChChartDataContainer } from '../data/ch-chart-data.class';
import { ChChartScaleColor, ChChartScaleColorLinear } from '../scale/ch-chart-scale-color.class';
import { ChChartDomain } from '../ch-chart-domain.class';
import { ChChartLegendHeatMap } from '../legend/ch-chart-legend-heat-map.class';
import { ChChartScaleBand } from '../scale/ch-chart-scale.class';
import { ChChartAxis, ChChartAxisBand } from '../drawer/ch-chart-axis.class';
import { ChChartRendererHeatMap } from '../../renderer/ch-chart-renderer-heat-map.plot';
import {
  ChChartLegendHeatMapComponent,
} from '../../component/ch-chart-right-section/ch-chart-legend-heat-map/ch-chart-legend-heat-map.component';
import { ChChartLabelFormatter } from '../ch-chart-label-formatter.class';

/**
 * Data container for heat map data
 */
export class ChChartHeatMapDataContainer implements ChChartDataContainer<ChChart3dDatum> {
  // name of the axis
  axisXLabel: string;
  axisYLabel: string;

  /**
   * Function to format the x-axis labels
   */
  axisXLabelFormat: ChChartLabelFormatter | null;

  /**
   * Function to format the y-axis labels
   */
  axisYLabelFormat: ChChartLabelFormatter | null;

  constructor(private data: ChChart3dDatum[][]) {}

  getColumnCount(): number {
    return this.data.length;
  }

  getRowCount(): number {
    return Math.max(...this.data.map((d) => d.length));
  }

  getData(): ChChart3dDatum[] {
    const data: ChChart3dDatum[] = [];
    this.data.forEach((d) => data.push(...d));
    return data;
  }

  getDomainXComplete(): number[] {
    return ChChartDomain.getCompleteDomain(this.getData().map((data) => data.getX()));
  }

  getDomainYComplete(): number[] {
    return ChChartDomain.getCompleteDomain(this.getData().map((data) => data.getY()));
  }

  /**
   * Set the list of x tick label for all the series. It defines the axisXLabelFormat
   * @param xTickLabels
   */
  public setXTickLabels(xTickLabels: string[]): void {
    if (xTickLabels) {
      this.axisXLabelFormat = ChChartLabelFormatter.fromTickLabels(xTickLabels);
    }
  }

  /**
   * Set the list of y tick label for all the series. It defines the axisYLabelFormat
   * @param yTickLabels
   */
  public setYTickLabels(yTickLabels: string[]): void {
    if (yTickLabels) {
      this.axisYLabelFormat = ChChartLabelFormatter.fromTickLabels(yTickLabels);
    }
  }
}

export class ChChartHeatMap extends ChChartConfig {
  private readonly colorScale: ChChartScaleColor;
  private readonly domain: [number, number];

  // predefined size for the rects
  private readonly rectSize = 18;

  constructor(protected dataContainer: ChChartHeatMapDataContainer) {
    super();

    // build color scale
    const zValues: number[] = dataContainer
      .getData()
      .map((data) => data.getZ()?.valueOf() ?? null)
      .filter((data) => data != null);
    this.domain = ChChartDomain.getLinearDomain(zValues);
    this.colorScale = new ChChartScaleColorLinear(this.domain);
  }

  getChartContainer(): ChChartContainer<any> {
    // Build X axis
    const xScale: ChChartScaleBand = new ChChartScaleBand()
      .setInitialDomain(this.dataContainer.getDomainXComplete())
      .padding(0.01);
    const xAxis: ChChartAxis = new ChChartAxisBand('bottom')
      .setScale(xScale)
      .setTickFormatter(this.dataContainer.axisXLabelFormat)
      .rotateTickText()
      .setLabel(this.dataContainer.axisXLabel);

    // Build Y axis
    const yScale: ChChartScaleBand = new ChChartScaleBand()
      // reverse the domain so the y = 0 is on top
      .setInitialDomain(this.dataContainer.getDomainYComplete().reverse())
      .padding(0.01);
    const yAxis: ChChartAxisBand = new ChChartAxisBand('left')
      .setScale(yScale)
      .setTickFormatter(this.dataContainer.axisYLabelFormat)
      .setLabel(this.dataContainer.axisYLabel);

    const chartContainer: ChChartContainer2Axis<ChChartHeatMapDataContainer> = new ChChartContainer2Axis();
    chartContainer
      .initXAxis(xAxis)
      .initAxisY(yAxis)
      .addRenderer(new ChChartRendererHeatMap(this.colorScale))
      .initData(this.dataContainer);

    // force the size of the chart so the heat map rect are squares
    const width = this.rectSize * this.dataContainer.getColumnCount();
    const height = this.rectSize * this.dataContainer.getRowCount();
    this.sizeConfig = {
      type: 'fixed',
      width,
      height,
    };

    return chartContainer;
  }

  getSVGLegend(): ChChartSVGLegend {
    return new ChChartLegendHeatMap(this.colorScale, this.domain);
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    return {
      componentType: ChChartLegendHeatMapComponent,
      data: this.getSVGLegend(), // use the svg legend renderer
    };
  }

  // no zoom
  getZoomBrush(): ChChartBrush {
    return undefined;
  }

  destroy(): void {}
}
