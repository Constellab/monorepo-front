import {
  ChChart2dMultiSerie,
  ChChartConfig,
  ChChartLine2d,
  ChChartScatterPlot2d,
  ChChartType,
} from '@monorepo/chart';

import { SpSheet } from '../sp-sheet.class';
import { SpSheetChartSelection } from './sp-sheet-chart-selection.class';
import { SpSheetChart2dSerieSelectionForm } from './sp-sheet-chart-selection-form.class';

export class SpSheetChartSelectionBasic extends SpSheetChartSelection {
  constructor(
    sheet: SpSheet,
    private chartType: ChChartType.LINE | ChChartType.SCATTER_PLOT,
    private series: SpSheetChart2dSerieSelectionForm[],
    private xAxisLabel?: string,
    private yAxisLabel?: string
  ) {
    super(sheet);
  }

  exportToChart(): ChChartConfig {
    const series: ChChart2dMultiSerie<any> = new ChChart2dMultiSerie();
    for (const serie of this.series) {
      series.addSerie(this.convert2DFormSelectionToChartSerie(serie));
    }

    series.axisXLabel = this.xAxisLabel;
    series.axisYLabel = this.yAxisLabel;

    if (this.chartType === ChChartType.LINE) {
      return new ChChartLine2d(series);
    } else {
      return new ChChartScatterPlot2d(series);
    }
  }
}
