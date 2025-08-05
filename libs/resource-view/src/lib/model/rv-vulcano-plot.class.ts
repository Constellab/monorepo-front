import { ChChart2dDatum, ChChart2dMultiSerie, ChChartConfig, ChChartVulcanoPlot } from '@monorepo/chart';

import { rvResourceBuildBasicChart2d, RvResourceViewChart2dData } from './rv-basic-plot-2d.class';
import { RvResourceViewBase } from './rv-resource-view.class';

export interface RvResourceViewVulcanoPlot extends RvResourceViewBase {
  type: 'vulcano-plot-view';
  data: RvResourceViewVulcanoPlotData;
}

export interface RvResourceViewVulcanoPlotData extends RvResourceViewChart2dData {
  x_threshold: number;
  y_threshold: number;
}

/**
 * Build a ChChart from a vulcano resource view
 */
export function rvVulcanoPlotToChart(view: RvResourceViewVulcanoPlot): ChChartConfig {
  const series: ChChart2dMultiSerie<ChChart2dDatum> = rvResourceBuildBasicChart2d(view.data);

  return new ChChartVulcanoPlot(series, view.data.x_threshold, view.data.y_threshold);
}
