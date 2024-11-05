import { ChChartData, ChChartDataContainer } from './ch-chart-data.class';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTagHelper } from '@monorepo/front-core-lib';
import { ChLegend } from '../legend/ch-chart-legend-multi-series.class';

/**
 * Key to distinguish a serie form another
 */
export interface ChChartDataWithSerie<T> {
  data: T;
  serieKey: number;
  serieName: string;
}

export interface ChChartSerieWithColor {
  name: string;
  color: string;
}

export interface ChChartSerieSimple {
  name: string;
  key: number | string;
}

export class ChChartSerie<Data extends ChChartData> implements ChChartDataContainer<Data>, ChLegend {
  private static key: number = 0;

  data: Data[];

  key: number;

  name: string;

  constructor(data: Data[], serieName: string) {
    this.data = data;
    this.key = ChChartSerie.key++;
    this.name = serieName;
  }

  public getDataWithSerie(getOnlyValid: boolean = false): ChChartDataWithSerie<Data>[] {
    const data: Data[] = getOnlyValid ? this.getValidData() : this.getData();

    return data.map((data) => {
      return {
        data: data,
        serieKey: this.key,
        serieName: this.name,
      };
    });
  }

  public getDataWithSerieAt(index: number): ChChartDataWithSerie<Data> {
    return {
      data: this.getData()[index] ?? null,
      serieKey: this.key,
      serieName: this.name,
    };
  }

  public countData(): number {
    return this.data.length;
  }

  public getData(): Data[] {
    return this.data;
  }

  /**
   * Retrieve only the valid data
   */
  public getValidData(): Data[] {
    return this.getData().filter((d) => d.valid);
  }

  public addData(data: Data | Data[]): void {
    const dataArray = ClHelpService.convertObjectOrArrayToArray(data);
    this.data.push(...dataArray);
  }

  /**
   * Return all the tags value of the data grouped by key
   */
  public getTagsGroupByKey(): Record<string, string[]> {
    return FlTagHelper.groupTagsByKey(this.getAllTags());
  }

  public getAllTags(): Record<string, string>[] {
    const tags: Record<string, string>[] = [];

    for (const data of this.data) {
      if (data.tags && Object.keys(data.tags).length > 0) {
        tags.push(data.tags);
      }
    }
    return tags;
  }
}
