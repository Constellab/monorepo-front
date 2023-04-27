import {SpSheetChartSelection} from './sp-sheet-chart-selection.class';
import {SpSheetChartSerieSelectionForm} from './sp-sheet-chart-selection-form.class';
import {SpSheet} from '../sp-sheet.class';
import {ClNumberHelper} from '@monorepo/core-lib';
import {SpSheetMultiSelection} from '../selection/sp-sheet-multi-selection.class';
import {ChChart3dDatum, ChChartConfig, ChChartHeatMap, ChChartHeatMapDataContainer} from '@monorepo/chart';

export class SpSheetChartSelectionHeatMap extends SpSheetChartSelection {


  constructor(sheet: SpSheet, private serie: SpSheetChartSerieSelectionForm,
              private xAxisLabel?: string, private yAxisLabel?: string) {
    super(sheet);
  }

  exportToChart(): ChChartConfig {

    const ySelection: SpSheetMultiSelection = this.getMultiSelectionFromSelectionRange(this.serie.y);

    const selections = ySelection.splitToColumnSelections();

    const chartData: ChChart3dDatum[][] = [];
    for(let i = 0; i < selections.length; i++){
      chartData.push(selections[i].getCellsValuesFlat().map(
        (value, index) => new ChChart3dDatum(i, index, ClNumberHelper.fromString(value, 0))
      ));
    }

    const dataContainer: ChChartHeatMapDataContainer = new ChChartHeatMapDataContainer(chartData);

    dataContainer.axisXLabel = this.xAxisLabel;
    dataContainer.axisYLabel = this.yAxisLabel;

    return new ChChartHeatMap(dataContainer);
  }

}
