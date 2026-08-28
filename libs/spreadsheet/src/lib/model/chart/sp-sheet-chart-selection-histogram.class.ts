import {
  ChChart2dMultiSerie,
  ChChartConfig,
  ChChartDataBin,
  chChartGetDataBins,
  ChChartHistogram,
  ChChartHistogramMode,
  ChChartLabelFormatter,
  ChChartSerie,
} from '@monorepo/chart';
import { ClNumberHelper } from '@monorepo/core-lib';

import { SpSheetSelection } from '../selection/sp-sheet-selection.class';
import { SpSheet } from '../sp-sheet.class';
import { SpSheetChartSelection } from './sp-sheet-chart-selection.class';
import { SpSheetChartSerieSelectionForm } from './sp-sheet-chart-selection-form.class';

export class SpSheetChartSelectionHistogram extends SpSheetChartSelection {
  constructor(
    sheet: SpSheet,
    private series: SpSheetChartSerieSelectionForm[],
    private mode: ChChartHistogramMode,
    private nbOfBins?: number | null,
    private xAxisLabel?: string | null,
    private yAxisLabel?: string | null
  ) {
    super(sheet);
  }

  exportToChart(): ChChartConfig {
    const series: ChChart2dMultiSerie<any> = new ChChart2dMultiSerie();

    const ySelection: SpSheetSelection | null = this.getMultiSelectionFromSelectionRange(
      this.series[0].y
    );
    // convert all the data to numbers
    const data: number[] = (ySelection?.getCellsValuesFlat() ?? [])
      .map((cellValue) => ClNumberHelper.fromString(cellValue))
      .filter((value) => value != null);

    // create the serie with bin data
    const serie: ChChartSerie<any> = new ChChartSerie<any>(
      chChartGetDataBins(data, this.mode, this.nbOfBins ?? undefined),
      this.series[0].name
    );

    // define the axisXLabelFormat
    series.axisXLabelTicksFormatter = new ChChartLabelFormatter((index: number) => {
      const chartDataBin: ChChartDataBin = serie.data[index];
      return chartDataBin.getIntervalShortText();
    }, ChChartDataBin.getIntervalTextLength());
    series.addSerie(serie);

    series.axisXLabel = this.xAxisLabel;
    series.axisYLabel = this.yAxisLabel;

    return new ChChartHistogram(series);
  }
}
