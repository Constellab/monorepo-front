import {SpSheetChartSelection} from './sp-sheet-chart-selection.class';
import {SpSheetChartSerieSelectionForm} from './sp-sheet-chart-selection-form.class';
import {SpSheet} from '../sp-sheet.class';
import {SpSheetSelection} from '../selection/sp-sheet-selection.class';
import {ClNumberHelper} from '@monorepo/core-lib';
import {
  ChChart2dMultiSerie,
  ChChartBarPlot,
  ChChartConfig, ChChartDataBin, chChartGetDataBins, ChChartHistogram, ChChartLabelFormatter,
  ChChartSerie,
  ChChartStackedBar,
  ChChartType
} from '@monorepo/chart';


// Basic bar plot and stack plot
export class SpSheetChartSelectionBarPlot extends SpSheetChartSelection {


  constructor(sheet: SpSheet, private chartType: ChChartType.BAR_PLOT | ChChartType.STACKED_PLOT,
              private series: SpSheetChartSerieSelectionForm[],
              private xAxisLabel?: string, private yAxisLabel?: string) {
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


// Histogram
export class SpSheetChartSelectionHistogram extends SpSheetChartSelection {

  constructor(sheet: SpSheet, private series: SpSheetChartSerieSelectionForm[],
              private nbOfBins?: number,
              private xAxisLabel?: string, private yAxisLabel?: string) {
    super(sheet);
  }

  exportToChart(): ChChartConfig {
    const series: ChChart2dMultiSerie<any> = new ChChart2dMultiSerie();

    const ySelection: SpSheetSelection = this.getMultiSelectionFromSelectionRange(this.series[0].y);
    // convert all the data to numbers
    const data: number[] = ySelection.getCellsValuesFlat().map(
      cellValue => ClNumberHelper.fromString(cellValue))
      .filter(value => value != null);

    // create the serie with bin data
    const serie: ChChartSerie<any> = new ChChartSerie<any>(chChartGetDataBins(data, this.nbOfBins),
      this.series[0].name);

    // define the axisXLabelFormat
    series.axisXLabelTicksFormatter = new ChChartLabelFormatter(
      (index: number) => {
        const ChartDataBin: ChChartDataBin = serie.data[index];
        return ChartDataBin.getIntervalText();
      },
      ChChartDataBin.getIntervalTextLength()
    );
    series.addSerie(serie);

    series.axisXLabel = this.xAxisLabel;
    series.axisYLabel = this.yAxisLabel;

    return new ChChartHistogram(series);

  }
}
