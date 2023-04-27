import {SpSheet} from '../sp-sheet.class';
import {SpSheetChart2dSerieSelectionForm} from './sp-sheet-chart-selection-form.class';
import {SpSheetChartSelection} from './sp-sheet-chart-selection.class';
import {ChChart2dMultiSerie, ChChartConfig, ChChartVulcanoPlot} from '@monorepo/chart';


export class SpSheetChartSelectionVulcanoPlot extends SpSheetChartSelection {
  constructor(sheet: SpSheet,
              private serie: SpSheetChart2dSerieSelectionForm,
              private xThreshold: number, private yThreshold: number,
              private xAxisLabel?: string, private yAxisLabel?: string) {
    super(sheet);
  }

  exportToChart(): ChChartConfig {

    // only take the first serie
    const series: ChChart2dMultiSerie<any> = new ChChart2dMultiSerie();
    series.addSerie(this.convert2DFormSelectionToChartSerie(this.serie));

    series.axisXLabel = this.xAxisLabel;
    series.axisYLabel = this.yAxisLabel;

    return new ChChartVulcanoPlot(series, this.xThreshold, this.yThreshold);
  }
}
