import {
  ChChart2dMultiSerie,
  ChChartBarPlot,
  ChChartConfig,
  ChChartStackedBar,
  ChChartType,
} from '@monorepo/chart';

import { SpSheet } from '../sp-sheet.class';
import { SpSheetChartSelection } from './sp-sheet-chart-selection.class';
import { SpSheetChartSerieSelectionForm } from './sp-sheet-chart-selection-form.class';

// Basic bar plot and stack plot
export class SpSheetChartSelectionBarPlot extends SpSheetChartSelection {
  constructor(
    sheet: SpSheet,
    private chartType: ChChartType.BAR_PLOT | ChChartType.STACKED_PLOT,
    private series: SpSheetChartSerieSelectionForm[],
    private xAxisLabel?: string | null,
    private yAxisLabel?: string | null
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

    if (this.chartType === ChChartType.BAR_PLOT) {
      return new ChChartBarPlot(series);
    } else {
      return new ChChartStackedBar(series);
    }
  }
}
