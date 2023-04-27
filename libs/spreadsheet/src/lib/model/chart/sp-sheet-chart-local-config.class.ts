import {SpSheet} from '../sp-sheet.class';
import {
  SpSheetChart2dSerieSelectionForm,
  SpSheetChartSelectionFormAdditional,
  SpSheetSelectionRange
} from './sp-sheet-chart-selection-form.class';
import {SpSheetChartSelectionBarPlot, SpSheetChartSelectionHistogram} from './sp-sheet-chart-selection-bar-plot.class';
import {SpSheetChartSelectionBoxPlot} from './sp-sheet-chart-selection-box-plot.class';
import {SpSheetChartSelectionHeatMap} from './sp-sheet-chart-selection-heat-map.class';
import {SpSheetChartSelectionBasic} from './sp-sheet-chart-selection-basic.class';
import {SpSheetChartSelection} from './sp-sheet-chart-selection.class';
import {SpSheetChartConfig, SpSpreadsheetChartSerieSelectionInput} from './sp-sheet-chart-config.class';
import {SpSheetChartSelectionVulcanoPlot} from './sp-sheet-chart-selection-vulcano-plot.class';
import {FlMenuDynamic, FlOverlayRef, FlPortalConfig} from '@monorepo/front-core-lib';
import {ChChartPortalConfig, ChChartPortalService, ChChartType} from '@monorepo/chart';


/**
 * Main config class to generate chart from the sheet locally
 */
export abstract class SpSheetLocalChartConfig extends SpSheetChartConfig {
  constructor(private chartPortalService: ChChartPortalService) {
    super();
  }

  protected openChartPortal(chartSelection: SpSheetChartSelection, contextMenuItems: FlMenuDynamic[]): FlOverlayRef {
    const chartPortalConfig: ChChartPortalConfig = {
      chart: chartSelection.exportToChart(),
      contextMenuItems: contextMenuItems
    };


    const portalConfig: FlPortalConfig = this.chartPortalService.configureAbsolutePortal(
      {centerHorizontally: '0', top: '0'},
      {
        disposeOnNavigation: true
      });

    return this.chartPortalService.createDynamicChartPortal(chartPortalConfig, portalConfig);
  }
}

//////////////////////////////////// LINE PLOT /////////////////////////////////////
export class SpSheetLocalChartConfigLinePlot extends SpSheetLocalChartConfig {

  getChartType(): ChChartType.LINE {
    return ChChartType.LINE;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionBasic(sheet, this.getChartType(), series,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'full',
      ySelectionMode: 'multi',
      xSelectionMode: 'multi'
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// SCATTER PLOT /////////////////////////////////////
export class SpSheetLocalChartConfigScatterPlot extends SpSheetLocalChartConfig {

  getChartType(): ChChartType.SCATTER_PLOT {
    return ChChartType.SCATTER_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionBasic(sheet, this.getChartType(), series,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForXAndY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'full',
      ySelectionMode: 'multi',
      xSelectionMode: 'multi'
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// VULCANO PLOT /////////////////////////////////////
export class SpSheetLocalChartConfigVulcanoPlot extends SpSheetLocalChartConfig {

  getChartType(): ChChartType.VULCANO_PLOT {
    return ChChartType.VULCANO_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    // create the selection object, only take the first serie
    const selection = new SpSheetChartSelectionVulcanoPlot(sheet, series[0],
      additionalFields.xThreshold, additionalFields.yThreshold,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForXAndY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'full',
      ySelectionMode: 'multi',
      xSelectionMode: 'multi'
    };
  }


  getNbMaxOfSeries(): number {
    return 1;
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xThreshold', 'yThreshold', 'xAxisLabel', 'yAxisLabel'];
  }
}


//////////////////////////////////// BAR PLOT /////////////////////////////////////
export class SpSheetLocalChartConfigBarPlot extends SpSheetLocalChartConfig {

  getChartType(): ChChartType.BAR_PLOT {
    return ChChartType.BAR_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionBarPlot(sheet, this.getChartType(), series,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'onlyY',
      ySelectionMode: 'multi',
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// STACKED BAR PLOT /////////////////////////////////////
export class SpSheetLocalChartConfigStackedBarPlot extends SpSheetLocalChartConfig {

  getChartType(): ChChartType.STACKED_PLOT {
    return ChChartType.STACKED_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionBarPlot(sheet, this.getChartType(), series,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'onlyY',
      ySelectionMode: 'multi',
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}



//////////////////////////////////// HISTOGRAM /////////////////////////////////////
export class SpSheetLocalChartConfigHistogram extends SpSheetLocalChartConfig {
  getChartType(): ChChartType {
    return ChChartType.HISTOGRAM;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionHistogram(sheet, series, additionalFields.nbOfBins,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }


  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createSingleSelectionForY(selectionRange);
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['nbOfBins', 'xAxisLabel', 'yAxisLabel'];
  }


  getNbMaxOfSeries(): number {
    return 1;
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'onlyY',
      ySelectionMode: 'multi',
    };
  }
}


//////////////////////////////////// BOX PLOT /////////////////////////////////////
export class SpSheetLocalChartConfigBoxPlot extends SpSheetLocalChartConfig {

  getChartType(): ChChartType {
    return ChChartType.BOX_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionBoxPlot(sheet, series,
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'onlyY',
      ySelectionMode: 'multi',
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}


//////////////////////////////////// HEAT MAP /////////////////////////////////////
export class SpSheetLocalChartConfigHeatMap extends SpSheetLocalChartConfig {

  getChartType(): ChChartType {
    return ChChartType.HEAT_MAP;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {
    const selection = new SpSheetChartSelectionHeatMap(sheet, series[0],
      additionalFields.xAxisLabel, additionalFields.yAxisLabel);
    return this.openChartPortal(selection, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createSingleSelectionForY(selectionRange);
  }

  getNbMaxOfSeries(): number {
    return 1;
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'onlyY',
      ySelectionMode: 'single',
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}


