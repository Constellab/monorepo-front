import { FlTagHelper } from '@monorepo/front-core-lib/fl-tag';

import { ChChartDomain } from '../ch-chart-domain.class';
import { ChChartLabelFormatter } from '../ch-chart-label-formatter.class';
import { ChChart2dDatum, ChChartData, ChChartDataContainer } from './ch-chart-data.class';
import { ChChartDataWithSerie, ChChartSerie } from './ch-chart-serie.class';

/**
 * Object to manage multiple series
 */
export class ChChartMultiSerie<Data extends ChChartData> implements ChChartDataContainer<Data> {
  series: ChChartSerie<Data>[];

  // name of the axis
  axisXLabel: string;
  axisYLabel: string;

  /**
   * Function to format the x-axis labels
   */
  axisXLabelTicksFormatter: ChChartLabelFormatter | null;

  /**
   * Function to format the y-axis labels
   */
  axisYLabelTicksFormatter: ChChartLabelFormatter | null;

  constructor(series: ChChartSerie<Data>[] = []) {
    this.series = series;
  }

  // flatten the data of the series
  getData(): Data[] {
    const data: Data[] = [];
    this.series.forEach((serie) => data.push(...serie.getData()));
    return data;
  }

  public addSerie(serie: ChChartSerie<Data>): void {
    // override the key of the serie with the index
    serie.key = this.series.length;
    this.series.push(serie);
  }

  public countSeries(): number {
    return this.series.length;
  }

  // return the biggest number of data for a serie
  public maxSerieDataCount(): number {
    return this.series.reduce((p, c) => (c.countData() > (p?.countData() ?? 0) ? c : p)).countData();
  }

  // return the indexes of the complete domain (array from 0 to N)
  getDomainCompleteIndexes(): number[] {
    return ChChartDomain.getCompleteDomainIndex(this.getData().length);
  }

  // return the indexes of the complete domain of the biggest serie
  getBiggestSerieDomainCompleteIndexes(): number[] {
    return ChChartDomain.getCompleteDomainIndex(this.maxSerieDataCount());
  }

  /**
   * return an array of data with serie
   * The first array contains all the series first value,
   * the second array all the series second value ...
   */
  public invert(): ChChartDataWithSerie<Data>[][] {
    const max: number = this.maxSerieDataCount();

    const data: ChChartDataWithSerie<Data>[][] = [];
    for (let i = 0; i < max; i++) {
      const d: ChChartDataWithSerie<Data>[] = [];

      for (const serie of this.series) {
        d.push(serie.getDataWithSerieAt(i));
      }

      data.push(d);
    }

    return data;
  }

  // return an array of series keys
  public getSeriesKeys(): number[] {
    return this.series.map((v) => v.key);
  }

  /**
   * Set the list of x tick label for all the series. It defines the axisXLabelFormat
   * @param xTickLabels
   */
  public setXTickLabels(xTickLabels: string[]): void {
    if (xTickLabels) {
      this.axisXLabelTicksFormatter = ChChartLabelFormatter.fromTickLabels(xTickLabels);
    }
  }

  /**
   * Set the list of y tick label for all the series. It defines the axisYLabelFormat
   * @param yTickLabels
   */
  public setYTickLabels(yTickLabels: string[]): void {
    if (yTickLabels) {
      this.axisYLabelTicksFormatter = ChChartLabelFormatter.fromTickLabels(yTickLabels);
    }
  }

  /**
   * Return all the tags value of the data grouped by key
   */
  public getTagsGroupByKey(): Record<string, string[]> {
    const tags: Record<string, string>[] = [];

    for (const serie of this.series) {
      tags.push(...serie.getAllTags());
    }
    return FlTagHelper.groupTagsByKey(tags);
  }
}

/**
 * Multiple series with 2d data
 */
export class ChChart2dMultiSerie<Data extends ChChart2dDatum> extends ChChartMultiSerie<Data> {
  getDomainXLinear(extendDomain: number = 0, minValue?: number, maxValue?: number): [number, number] {
    return ChChartDomain.getLinearDomain(
      this.getData().map((data) => data.getX()),
      extendDomain,
      minValue,
      maxValue
    );
  }

  getDomainXComplete(): number[] {
    return ChChartDomain.getCompleteDomain(this.getData().map((data) => data.getX()));
  }

  getDomainYLinear(extendDomain: number = 0, minValue?: number, maxValue?: number): [number, number] {
    return ChChartDomain.getLinearDomain(
      this.getData().map((data) => data.getY()),
      extendDomain,
      minValue,
      maxValue
    );
  }

  getDomainYComplete(): number[] {
    return ChChartDomain.getCompleteDomain(this.getData().map((data) => data.getY()));
  }

  getDomainYStacked(extendDomain: number = 0, minValue?: number, maxValue?: number): [number, number] {
    const data: number[] = [];
    for (const serie of this.series) {
      const serieData = serie.getData();
      for (let i = 0; i < serieData.length; i++) {
        if (data[i] == null) {
          data[i] = serieData[i].getY();
        } else {
          data[i] += serieData[i].getY();
        }
      }
    }

    return ChChartDomain.getLinearDomain(data, extendDomain, minValue, maxValue);
  }

  /**
   * Group the series data by X
   * The first array contains all the series value corresponding to X = 0,
   * the second array all the series value where X = 1 ...
   */
  public groupByX(): ChChartDataWithSerie<Data>[][] {
    const maxX: number = this.getMaxSerieX();

    const data: ChChartDataWithSerie<Data>[][] = [];
    for (let i = 0; i <= maxX; i++) {
      const d: ChChartDataWithSerie<Data>[] = [];

      for (const serie of this.series) {
        const data = serie.getData().find((d) => d.getX() === i);

        if (data) {
          d.push({
            data: data,
            serieKey: serie.key,
            serieName: serie.name,
          });
        }
      }

      data.push(d);
    }

    return data;
  }

  public getMaxSerieX(): number {
    this.series[0].getData().map((d) => d.getX());

    let maxX = 0;
    for (const serie of this.series) {
      const x = Math.max(...serie.getData().map((d) => d.getX(0)));
      if (x > maxX) maxX = x;
    }
    return maxX;
  }
}
