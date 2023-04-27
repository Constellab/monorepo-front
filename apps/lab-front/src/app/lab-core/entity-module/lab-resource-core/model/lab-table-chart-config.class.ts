import {
  FlMenuDynamic,
  FlOverlayRef,
  FlPortalConfig,
  FlPortalService,
} from '@monorepo/front-core-lib';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {LabResourceTableService, LabTableChartType} from '../../../entity-service/lab-resource-table.service';
import {LabResourceView} from '../../../model/entities/resource/lab-resource-view.entity';
import {
  LabResourceViewPortalComponent,
  LabResourceViewPortalInput
} from '../component/lab-resource-view-portal/lab-resource-view-portal.component';
import {RvTransformerParams} from '@monorepo/resource-view';
import {PrConfigValues} from '@monorepo/protocol';
import {
  SpSheet,
  SpSheetChart2dSerieSelectionForm,
  SpSheetChartConfig,
  SpSheetChartSelectionFormAdditional, SpSheetSelectionRange, SpSpreadsheetChartSerieSelectionInput
} from '@monorepo/spreadsheet';
import { ChChartType } from '@monorepo/chart';

/**
 * Main config class to generate chart from the sheet by calling the resource service
 */
export abstract class LabTableChartConfig extends SpSheetChartConfig {

  constructor(private resourceId: string, private tableViewMethodName: string,
              private tableViewConfig: PrConfigValues, private tableTransformers: RvTransformerParams[],
              private resourceTableService: LabResourceTableService, private portalService: FlPortalService) {
    super();
  }

  protected callChartOnTable(chartType: LabTableChartType, chartConfig: PrConfigValues,
                             contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.resourceTableService.callChartOnTable(this.resourceId, this.tableViewMethodName,
      this.tableViewConfig, this.tableTransformers, chartType, chartConfig).pipe(
      map((view) => this.openChartPortal(view, contextMenuItems)),
    );
  }

  /**
   * Open the chart portal after chart selection
   * @private
   */
  protected openChartPortal(labView: LabResourceView, contextMenuItems?: FlMenuDynamic[]): FlOverlayRef {

    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      {centerHorizontally: '0', top: '0'},
      {
        disposeOnNavigation: true,
      });

    const config: LabResourceViewPortalInput = {
      labView: labView,
      contextMenuItems: contextMenuItems
    };

    return this.portalService.createPortal(LabResourceViewPortalComponent, portalConfig, config);
  }
}

/**
 * Main config class to generate 2d chart from the sheet by calling the resource service
 */
export abstract class LabTableChart2dConfig extends LabTableChartConfig {

  generate2dChart(chartType: LabTableChartType, chartConfig: PrConfigValues,
                  additionalFields: SpSheetChartSelectionFormAdditional,
                  contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    const fullChartConfig: PrConfigValues = Object.assign({
      x_axis_label: additionalFields.xAxisLabel,
      y_axis_label: additionalFields.yAxisLabel,
    }, chartConfig);

    return this.callChartOnTable(chartType, fullChartConfig, contextMenuItems);
  }


  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// LINE PLOT /////////////////////////////////////
export class LabTableChartConfigLinePlot extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.LINE;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('line-plot-2d', {series: series},
      additionalFields, contextMenuItems);
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
export class LabTableChartConfigScatterPlot extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.SCATTER_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('scatter-plot-2d', {series: series},
      additionalFields, contextMenuItems);
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
export class LabTableChartConfigVulcanoPlot extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.VULCANO_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('vulcano-plot',
      {
        series: series,
        x_threshold: additionalFields.xThreshold,
        y_threshold: additionalFields.yThreshold,
      },
      additionalFields, contextMenuItems);
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
export class LabTableChartConfigBarPlot extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.BAR_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('bar-plot', {series: series},
      additionalFields, contextMenuItems);
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
export class LabTableChartConfigStackedBarPlot extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.STACKED_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('stack-bar-plot',
      {
        series: series,
        normalize: additionalFields.normalize,
      },
      additionalFields, contextMenuItems);
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
    return ['normalize', 'xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// HISTOGRAM /////////////////////////////////////
export class LabTableChartConfigHistogram extends LabTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.HISTOGRAM;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('histogram',
      {
        series: series,
        nbins: additionalFields.nbOfBins,
        density: additionalFields.density,
      },
      additionalFields, contextMenuItems);
  }


  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createSingleSelectionForY(selectionRange);
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['nbOfBins', 'density', 'xAxisLabel', 'yAxisLabel'];
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
export class LabTableChartConfigBoxPlot extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.BOX_PLOT;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('box-plot', {series: series},
      additionalFields, contextMenuItems);
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
export class LabTableChartConfigHeatMap extends LabTableChart2dConfig {

  getChartType(): ChChartType {
    return ChChartType.HEAT_MAP;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.generate2dChart('heatmap', {serie: series[0]},
      additionalFields, contextMenuItems);
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


//////////////////////////////////// VENN DIAGRAM /////////////////////////////////////
export class LabTableChartConfigVennDiagram extends LabTableChartConfig {

  getChartType(): ChChartType {
    return ChChartType.VENN_DIAGRAM;
  }

  generateChart(series: SpSheetChart2dSerieSelectionForm[], additionalFields: SpSheetChartSelectionFormAdditional,
                sheet: SpSheet, contextMenuItems?: FlMenuDynamic[]): Observable<FlOverlayRef> {
    return this.callChartOnTable('venn-diagram', {series: series}, contextMenuItems);
  }

  createSeriesFromDataRange(sheet: SpSheet, selectionRange: SpSheetSelectionRange): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForY(sheet, selectionRange);
  }

  getNbMaxOfSeries(): number {
    return 4;
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'onlyY',
      ySelectionMode: 'multi',
    };
  }
}
