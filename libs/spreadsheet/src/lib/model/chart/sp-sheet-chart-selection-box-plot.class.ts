import {
  ChChartBoxPlot,
  ChChartBoxPlotSerie,
  ChChartConfig,
  chChartGetBoxPlotData,
  ChChartMultiSerie,
} from '@monorepo/chart';

import { SpSheetSelection } from '../selection/sp-sheet-selection.class';
import { SpSheet } from '../sp-sheet.class';
import { SpSheetChartSelection } from './sp-sheet-chart-selection.class';
import { SpSheetChartSerieSelectionForm } from './sp-sheet-chart-selection-form.class';

export class SpSheetChartSelectionBoxPlot extends SpSheetChartSelection {
  constructor(
    sheet: SpSheet,
    private series: SpSheetChartSerieSelectionForm[],
    private xAxisLabel?: string | null,
    private yAxisLabel?: string | null
  ) {
    super(sheet);
  }

  exportToChart(): ChChartConfig {
    const series: ChChartMultiSerie<any> = new ChChartMultiSerie();

    for (const serie of this.series) {
      const ySelection: SpSheetSelection | null = this.getMultiSelectionFromSelectionRange(serie.y);
      const values: number[] = this.getSelectionValues(ySelection);

      series.addSerie(new ChChartBoxPlotSerie([chChartGetBoxPlotData(values)], serie.name));
    }

    series.axisXLabel = this.xAxisLabel;
    series.axisYLabel = this.yAxisLabel;

    return new ChChartBoxPlot(series);
  }
}
