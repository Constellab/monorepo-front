import { Selection } from 'd3-selection';
import { ChChartColorFunction } from '../model/scale/ch-chart-scale-color.class';
import { ChChartAxis } from '../model/drawer/ch-chart-axis.class';
import { FlThemeDetail, FlThemeService } from '@monorepo/front-core-lib';

/**
 * Object needed by the renderer to renderer the chart
 */
export interface ChChartNoAxisRendererInput<Data> {
  container: Selection<Element, null, null, null>;
  data: Data;
  chartHeight: number;
  chartWidth: number;
}

/**
 * Object needed by the renderer to renderer the charts with 2 axis
 */
export interface ChChart2AxisRendererInput<Data> extends ChChartNoAxisRendererInput<Data> {
  xAxis: ChChartAxis;
  yAxis: ChChartAxis;
}

/**
 * interface to implement to render graph without axis
 */
export abstract class ChChartNoAxisRenderer<Data> {
  protected data: ChChartNoAxisRendererInput<Data>;

  private _theme: FlThemeDetail;

  abstract renderFirst(): void;

  setData(data: ChChartNoAxisRendererInput<Data>): void {
    this.data = data;
  }

  protected getTheme(): FlThemeDetail {
    if (this._theme == null) {
      this._theme = FlThemeService.getInstance().getCurrentThemeDetail();
    }
    return this._theme;
  }
}

/**
 * interface to implement to render graph with 2 axis
 */
export abstract class ChChart2AxisRenderer<Data> extends ChChartNoAxisRenderer<Data> {
  protected data: ChChart2AxisRendererInput<Data>;

  abstract renderFirst(): void;

  abstract refreshRender(): void;
}

/**
 * interface to implement to render graph with 2 axis that support color change
 * for the data (point, line, ...)
 *
 * @Data data container
 * @Datum one datum of the data to color the element
 */
export abstract class ChChart2AxisRendererWithColors<Data, Datum> extends ChChart2AxisRenderer<Data> {
  // function to return the color for a datum
  protected currentColorFunction: ChChartColorFunction<Datum>;

  protected constructor(protected defaultColorFunction: ChChartColorFunction<Datum>) {
    super();
    // init the current color function
    this.currentColorFunction = defaultColorFunction;
  }

  /**
   * Method called when the color function changed to refresh the color on the chart
   * @param colorFunction
   * @protected
   */
  protected abstract refreshColor(colorFunction: ChChartColorFunction<Datum>): void;

  /**
   * Set the default color function
   */
  resetColors(): void {
    this.setColorFunction(this.defaultColorFunction);
  }

  /**
   * Set a new color function
   * @param colorFunction
   */
  setColorFunction(colorFunction: ChChartColorFunction<Datum>): void {
    this.currentColorFunction = colorFunction;

    if (this.data) {
      this.refreshColor(colorFunction);
    }
  }
}
