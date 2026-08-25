import { ascending, quantile } from 'd3';

import { ChChartData } from './ch-chart-data.class';
import { ChChartSerie } from './ch-chart-serie.class';

export interface ChChartBoxPlotData extends ChChartData {
  q1: number;
  median: number;
  q3: number;
  lowerWhisker: number;
  upperWhisker: number;
  min: number;
  max: number;
  // nbOfData: number;
}

/**
 * Specific serie type for the box plot
 */
export class ChChartBoxPlotSerie extends ChChartSerie<ChChartBoxPlotData> {
  constructor(boxPlotData: ChChartBoxPlotData[], serieName: string) {
    // we set an array of number as data to have a correct domain
    super(boxPlotData, serieName);
  }
}

/**
 * returns the box plot information for a list of number
 * @param data
 */
export function chChartGetBoxPlotData(data: number[]): ChChartBoxPlotData {
  const sortedData: number[] = data.sort(ascending);

  // quantile() only returns undefined for an empty data set
  const q1 = quantile(sortedData, 0.25) as number;
  const median = quantile(sortedData, 0.5) as number;
  const q3 = quantile(sortedData, 0.75) as number;
  const interQuantileRange = q3 - q1;
  const lowerWhisker = q1 - 1.5 * interQuantileRange;
  const upperWhisker = q3 + 1.5 * interQuantileRange;
  const min = data[0];
  const max = data[sortedData.length - 1];

  return {
    q1: q1,
    median: median,
    q3: q3,
    lowerWhisker: lowerWhisker,
    upperWhisker: upperWhisker,
    min: min,
    max: max,
    valid: true,
    // nbOfData: data.length
  };
}
