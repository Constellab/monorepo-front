import {
  ChChartHeatMapDataPortalComponent,
  ChChartHeatMapDataPortalInput,
} from '../component/ch-chart-data-portal/ch-chart-heat-map-data-portal/ch-chart-heat-map-data-portal.component';
import { ChChartHeatMapDataContainer } from '../model/chart/ch-chart-heat-map.class';
import { ChChart3dDatum } from '../model/data/ch-chart-data.class';
import { ChChartPortalHandler } from '../model/portal-handler/ch-chart-portal-handler.class';
import { ChChartScaleBand } from '../model/scale/ch-chart-scale.class';
import { ChChartScaleColor } from '../model/scale/ch-chart-scale-color.class';
import { ChChart2AxisRenderer } from './ch-chart-renderer.class';

export class ChChartRendererHeatMap extends ChChart2AxisRenderer<ChChartHeatMapDataContainer> {
  private portalHandler: ChChartPortalHandler = new ChChartPortalHandler();

  constructor(private colorScale: ChChartScaleColor) {
    super();
  }

  renderFirst(): void {
    const data: ChChart3dDatum[] = this.data.data.getData();
    const xScale: ChChartScaleBand = this.data.xAxis.scale as ChChartScaleBand;
    const yScale: ChChartScaleBand = this.data.yAxis.scale as ChChartScaleBand;

    this.data.container
      .selectAll()
      .data(data)
      .enter()
      .append('rect')
      .on('mouseover', (event, d) => this.onMouseHover(event, d))
      .on('mouseout', () => this.onMouseOut())
      .on('click', (event, d) => this.onMouseClick(event, d))
      .attr('x', (d: ChChart3dDatum) => xScale.scale(d.getX()))
      .attr('y', (d) => yScale.scale(d.getY()))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', (d) => {
        const z = d.getZ();
        return z != null ? this.colorScale.scale(z.valueOf()) : null;
      });
  }

  refreshRender(): void {
    throw new Error('Refresh not supported in Heat map');
  }

  private onMouseClick(event: MouseEvent, d: ChChart3dDatum): void {
    this.openPortal(event, d, true);
  }

  private onMouseHover(event: MouseEvent, d: ChChart3dDatum): void {
    this.openPortal(event, d, false);
  }

  private openPortal(event: MouseEvent, d: ChChart3dDatum, fixPortal: boolean): void {
    const data: ChChartHeatMapDataPortalInput = {
      data: d,
      xLabelFormatter: this.data.xAxis.getTickFormatter(),
      yLabelFormatter: this.data.yAxis.getTickFormatter(),
    };
    this.portalHandler.openPortal(event.target as any, ChChartHeatMapDataPortalComponent, data, fixPortal);
  }

  private onMouseOut(): void {
    this.portalHandler.closePortal();
  }
}
