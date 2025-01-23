import { scaleLinear } from 'd3';
import { ChChartScaleI } from './ch-chart-scale.class';
import { ScaleLinear } from 'd3-scale';
import { ChChartMultiSerie } from '../data/ch-chart-multi-serie.class';
import { ChChartDataWithSerie } from '../data/ch-chart-serie.class';
import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';

export type ChChartColorFunction<T = any> = (d: T) => string;
export const chChartTransparentColorOpacity = 0.8;

/**
 * Specific scale to return a color based on a value
 */
export interface ChChartScaleColor extends ChChartScaleI {
  /**
   * return a color base on a value
   * @param value
   */
  scale(value: any): string;
}

/**
 * Color scale contains a list of colors and return one color based on domain
 */
export class ChChartScaleColorMulti implements ChChartScaleColor {
  private keyColor: Record<string, string>;

  constructor(domain: (number | string)[], transparentColor: boolean = false) {
    this.initScale(domain, transparentColor);
  }

  // create a color scale from a multiple series. Each series key is linked to a color
  public static fromMultiSeries(
    dataContainer: ChChartMultiSerie<any>,
    transparentColor: boolean = false
  ): ChChartScaleColorMulti {
    return new ChChartScaleColorMulti(
      dataContainer.series.map((d) => d.key),
      transparentColor
    );
  }

  private initScale(domain: (number | string)[], transparentColor: boolean): void {
    const transparency: number = transparentColor ? 0.8 : 1;
    const colors = FlColorHelper.getColorList(transparency);

    const keyColors: Record<string, string> = {};
    for (let i = 0; i < domain.length; i++) {
      keyColors[domain[i].toString()] = colors[i % colors.length];
    }

    this.keyColor = keyColors;
  }

  public scale(value: number | string): string {
    return this.keyColor[value.toString()];
  }

  /**
   * Get the function to get the color from a ChChartDataWithSerie
   */
  public exportToColorSeriesFunction(): ChChartColorFunction<ChChartDataWithSerie<any>> {
    return (d: ChChartDataWithSerie<any>) => this.scale(d.serieKey);
  }
}

/**
 * Color scale to make a gradient color scale
 */
export class ChChartScaleColorLinear implements ChChartScaleColor {
  public readonly d3Scale: ScaleLinear<string, string>;

  /**
   *
   * @param domain domain of the values
   * @param fromColor color for lowest value
   * @param toColor color for highest value
   */
  constructor(
    domain: number[],
    private fromColor: string = FlColorHelper.blue,
    private toColor: string = FlColorHelper.red
  ) {
    this.d3Scale = this.initScale();
    this.d3Scale.domain(domain);
  }

  private initScale(): ScaleLinear<string, string> {
    // the range contains all available colors
    return scaleLinear<string>().range([this.fromColor, this.toColor]);
  }

  public scale(value: number): string {
    if (value == null) return 'white';
    return this.d3Scale(value);
  }
}

/**
 * Color scale that return only one color
 */
export class ChChartScaleColorSimple implements ChChartScaleColor {
  constructor(private color: string) {}

  public scale(): string {
    return this.color;
  }
}
