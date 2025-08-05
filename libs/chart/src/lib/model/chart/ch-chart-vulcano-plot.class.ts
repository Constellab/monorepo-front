import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';

import {
  ChChartLegendSeriesWithTagsComponent,
  ChChartLegendSerieWithTagsInput,
} from '../../component/ch-chart-right-section/ch-chart-legend-series-with-tags/ch-chart-legend-series-with-tags.component';
import { ChChart2AxisRenderer } from '../../renderer/ch-chart-renderer.class';
import { ChChartRendererScatterPlot } from '../../renderer/ch-chart-renderer-scatter.plot';
import {
  ChChartLine,
  ChChartRendererStraightLines,
} from '../../renderer/ch-chart-renderer-straight-lines.class';
import { ChChartRightSectionConfig } from '../ch-chart-config.class';
import { ChChart2dDatum } from '../data/ch-chart-data.class';
import { ChChart2dMultiSerie } from '../data/ch-chart-multi-serie.class';
import { ChChartDataWithSerie } from '../data/ch-chart-serie.class';
import { ChChartSVGLegend } from '../legend/ch-chart-legend.class';
import { ChChartColorFunction, chChartTransparentColorOpacity } from '../scale/ch-chart-scale-color.class';
import { ChChartLinear2d } from './ch-chart-linear-2d.class';

export class ChChartVulcanoPlot extends ChChartLinear2d {
  constructor(
    dataContainer: ChChart2dMultiSerie<any>,
    private xThreshold: number,
    private yThreshold: number
  ) {
    super(dataContainer);
    this.xThreshold = Math.abs(this.xThreshold);
  }

  createRenderers(): ChChart2AxisRenderer<ChChart2dMultiSerie<any>>[] {
    const scatterPlotRenderer = new ChChartRendererScatterPlot(this.getColorFunction(), this.tagColorer);
    return [scatterPlotRenderer, new ChChartRendererStraightLines(this.getLines())];
  }

  private getLines(): ChChartLine[] {
    return [
      {
        orientation: 'vertical',
        position: -this.xThreshold,
      },
      {
        orientation: 'vertical',
        position: this.xThreshold,
      },
      {
        orientation: 'horizontal',
        position: this.yThreshold,
      },
    ];
  }

  protected getExtendDomain(): number {
    return 0.5;
  }

  getRightSectionConfig(): ChChartRightSectionConfig {
    const data: ChChartLegendSerieWithTagsInput = {
      series: null, // deactivate the series list
      seriesColorScale: null, // deactivate the series list
      tagColorer: this.tagColorer,
    };
    return {
      componentType: ChChartLegendSeriesWithTagsComponent,
      data: data,
    };
  }

  getSVGLegend(): ChChartSVGLegend {
    return null;
  }

  private getColorFunction(): ChChartColorFunction<ChChartDataWithSerie<unknown>> {
    const colors = FlColorHelper.getColorList(chChartTransparentColorOpacity);
    const xThreshold = Math.abs(this.xThreshold);
    return (d: ChChartDataWithSerie<ChChart2dDatum>) => {
      if (d.data.getX() < -xThreshold && d.data.getY() > this.yThreshold) {
        return colors[0];
      } else if (d.data.getX() > xThreshold && d.data.getY() > this.yThreshold) {
        return colors[1];
      } else {
        return this.getTheme().cardBackground;
      }
    };
  }
}
