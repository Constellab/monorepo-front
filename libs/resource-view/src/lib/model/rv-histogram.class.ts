import {
  ChChart2dMultiSerie,
  ChChartConfig,
  ChChartDataBin,
  ChChartHistogram,
  ChChartHistogramMode,
  ChChartLabelFormatter,
  ChChartSerie,
} from '@monorepo/chart';

import { RvResourceViewBase } from './rv-resource-view.class';

export interface RvResourceViewHistogram extends RvResourceViewBase {
  type: 'histogram-view';
  data: RvResourceViewHistogramData;
}

export interface RvResourceViewHistogramData {
  x_label: string;
  y_label: string;
  series: RvResourceViewHistogramSerie[];
  mode: ChChartHistogramMode;
}

export interface RvResourceViewHistogramSerie {
  data: {
    x: number[]; // list of bin interval (two side values represent an interval), one more value than hist
    y: number[]; // list of hist values, number of values per interval
  };
  name: string;
}

/**
 * Convert a resource histogram view to a Chart
 * @param view
 */
export function rvHistogramToChart(view: RvResourceViewHistogram): ChChartConfig {
  const series: ChChart2dMultiSerie<ChChartDataBin> = new ChChart2dMultiSerie();

  for (const viewSerie of view.data.series) {
    const data: ChChartDataBin[] = [];

    for (let i = 0; i < viewSerie.data.x.length - 1; i++) {
      // create the bin
      const min = viewSerie.data.x[i];
      const max = viewSerie.data.x[i + 1];
      data.push(new ChChartDataBin(i, viewSerie.data.y[i], min, max, view.data.mode));
    }

    series.addSerie(new ChChartSerie(data, viewSerie.name));
  }

  // define the axisXLabelFormat
  series.axisXLabelTicksFormatter = new ChChartLabelFormatter((index: number) => {
    const dataHisto: ChChartDataBin = series.series[0].data[index];
    return dataHisto.getIntervalShortText();
  }, ChChartDataBin.getIntervalTextLength());

  if (view.data.x_label) {
    series.axisXLabel = view.data.x_label;
  }

  if (view.data.y_label) {
    series.axisYLabel = view.data.y_label;
  }

  return new ChChartHistogram(series);
}
