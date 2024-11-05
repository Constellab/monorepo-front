import {
  ChChart2dDatum,
  ChChart2dMultiSerie,
  ChChartBarPlot,
  ChChartConfig,
  ChChartLine2d,
  ChChartScatterPlot2d,
  ChChartSerie,
  ChChartStackedBar,
} from '@monorepo/chart';
import { RvResourceViewBase } from './rv-resource-view.class';

export interface RvResourceViewBasicPlot2d extends RvResourceViewBase {
  type: 'scatter-plot-2d-view' | 'line-plot-2d-view' | 'bar-plot-view' | 'stacked-bar-plot-view';
  data: RvResourceViewChart2dData;
}

export interface RvResourceViewChart2dData {
  x_tick_labels?: string[]; // if provided, those values should be displayed as X
  x_label: string; // name of the x-axis
  y_label: string; // name of the y-axis
  series: RvResourceViewChart2dSerie[];
}

export interface RvResourceViewChart2dSerie {
  data: {
    x: number[];
    y: number[];
    tags?: Record<string, string>[];
  };
  name?: string;
}

/**
 * Build a ChChart from a basic resource view
 * @param view
 */
export function rvBasicPlotToChart(view: RvResourceViewBasicPlot2d): ChChartConfig {
  const series: ChChart2dMultiSerie<ChChart2dDatum> = rvResourceBuildBasicChart2d(view.data);

  switch (view.type) {
    case 'scatter-plot-2d-view':
      return new ChChartScatterPlot2d(series);
    case 'line-plot-2d-view':
      return new ChChartLine2d(series);
    case 'bar-plot-view':
      return new ChChartBarPlot(series);
    case 'stacked-bar-plot-view':
      return new ChChartStackedBar(series);
  }
}

export function rvResourceBuildBasicChart2d(
  viewData: RvResourceViewChart2dData
): ChChart2dMultiSerie<ChChart2dDatum> {
  const series: ChChart2dMultiSerie<ChChart2dDatum> = new ChChart2dMultiSerie();

  let serieIndex: number = 1;
  for (const viewSerie of viewData.series) {
    const data: ChChart2dDatum[] = [];

    for (let i = 0; i < viewSerie.data.x.length; i++) {
      const datum = new ChChart2dDatum(viewSerie.data.x[i], viewSerie.data.y[i]);
      datum.tags = viewSerie.data.tags ? viewSerie.data.tags[i] : null;
      data.push(datum);
    }

    series.addSerie(new ChChartSerie(data, viewSerie.name ?? serieIndex.toString()));
    serieIndex++;
  }

  // if there are some tick labels
  if (viewData.x_tick_labels?.length > 0) {
    series.setXTickLabels(viewData.x_tick_labels);
  }

  // set the labels
  if (viewData.x_label) {
    series.axisXLabel = viewData.x_label;
  }
  if (viewData.y_label) {
    series.axisYLabel = viewData.y_label;
  }

  return series;
}
