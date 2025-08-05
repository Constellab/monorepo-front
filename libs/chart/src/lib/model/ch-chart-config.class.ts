import { Type } from '@angular/core';
import { FlThemeDetail, FlThemeService } from '@monorepo/front-core-lib/fl-theme';

import {
  ChChartRightSectionDirective,
} from '../component/ch-chart-right-section/ch-chart-right-section.directive';
import { ChChartBrush } from './drawer/ch-chart-brush.class';
import { ChChartContainer } from './drawer/ch-chart-container.class';
import { ChChartSVGLegend } from './legend/ch-chart-legend.class';

/**
 * Configuration to create the component for the right section of the chart (usually the legend)
 */
export interface ChChartRightSectionConfig {
  componentType: Type<ChChartRightSectionDirective>;
  data: any; // data to pass to the component
}

/**
 * Configure the size of the chart
 */
export type ChChartSizeConfig =
  | {
      // the complete chart will fit the container
      type: 'fit-container';
    }
  // define a fixed size for the chart renderer (excluding the legend, axis, etc.)
  | {
      type: 'fixed';
      width: number;
      height: number;
    };

/**
 * Config object to draw a new chart
 */
export abstract class ChChartConfig {
  public sizeConfig: ChChartSizeConfig = { type: 'fit-container' };

  private _theme: FlThemeDetail;

  abstract getChartContainer(): ChChartContainer<any>;

  abstract getRightSectionConfig(): ChChartRightSectionConfig;

  abstract getSVGLegend(): ChChartSVGLegend;

  abstract getZoomBrush(): ChChartBrush;

  abstract destroy(): void;

  protected getTheme(): FlThemeDetail {
    if (this._theme == null) {
      this._theme = FlThemeService.getInstance().getCurrentThemeDetail();
    }
    return this._theme;
  }
}
