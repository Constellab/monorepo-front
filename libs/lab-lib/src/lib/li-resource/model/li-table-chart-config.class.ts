import { ChChartType } from '@monorepo/chart';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { LiResourceTableService, LiResourceView, LiTableChartType } from '@monorepo/lab-lib/li-core';
import {
  LiResourceViewPortalComponent,
  LiResourceViewPortalInput,
} from '../component/li-resource-view-portal/li-resource-view-portal.component';
import { Observable } from 'rxjs';
import {
  SpSheet,
  SpSheetChart2dSerieSelectionForm,
  SpSheetChartConfig,
  SpSheetChartSelectionFormAdditional,
  SpSheetSelectionRange,
  SpSpreadsheetChartSerieSelectionInput,
  SpSpreadsheetGenerateChartOptions,
} from '@monorepo/spreadsheet';
import { TdParamSpecsValues } from '@monorepo/technical-doc';
import { ViewContainerRef } from '@angular/core';
import { map } from 'rxjs/operators';

/**
 * Main config class to generate chart from the sheet by calling the resource service
 */
export abstract class LiTableChartConfig extends SpSheetChartConfig {
  constructor(
    private resourceId: string,
    private tableViewMethodName: string,
    private tableViewConfig: TdParamSpecsValues,
    private resourceTableService: LiResourceTableService,
    private portalService: FlPortalService,
    private viewContainerRef: ViewContainerRef
  ) {
    super();
  }

  protected callChartOnTable(
    chartType: LiTableChartType,
    chartConfig: TdParamSpecsValues,
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.resourceTableService
      .callChartOnTable(
        this.resourceId,
        this.tableViewMethodName,
        this.tableViewConfig,
        chartType,
        chartConfig
      )
      .pipe(map((view) => this.openChartPortal(view, options)));
  }

  /**
   * Open the chart portal after chart selection
   * @private
   */
  protected openChartPortal(
    labView: LiResourceView,
    options: SpSpreadsheetGenerateChartOptions
  ): FlOverlayRef {
    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { centerHorizontally: '0', top: '0' },
      {
        disposeOnNavigation: true,
      }
    );

    const config: LiResourceViewPortalInput = {
      labView: labView,
      contextMenuItems: options.contextMenuItems,
      editView: options.updateSelection,
    };

    return this.portalService.createPortal(
      LiResourceViewPortalComponent,
      portalConfig,
      config,
      this.viewContainerRef
    );
  }
}

/**
 * Main config class to generate 2d chart from the sheet by calling the resource service
 */
export abstract class LiTableChart2dConfig extends LiTableChartConfig {
  generate2dChart(
    chartType: LiTableChartType,
    chartConfig: TdParamSpecsValues,
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    const fullChartConfig: TdParamSpecsValues = Object.assign(
      {
        x_axis_label: options.additionalFields.xAxisLabel,
        y_axis_label: options.additionalFields.yAxisLabel,
      },
      chartConfig
    );

    return this.callChartOnTable(chartType, fullChartConfig, options);
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// LINE PLOT /////////////////////////////////////
export class LiTableChartConfigLinePlot extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.LINE;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart('line-plot-2d', { series: series }, options);
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'full',
      ySelectionMode: 'multi',
      xSelectionMode: 'multi',
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// SCATTER PLOT /////////////////////////////////////
export class LiTableChartConfigScatterPlot extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.SCATTER_PLOT;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart('scatter-plot-2d', { series: series }, options);
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForXAndY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'full',
      ySelectionMode: 'multi',
      xSelectionMode: 'multi',
    };
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['xAxisLabel', 'yAxisLabel'];
  }
}

//////////////////////////////////// VULCANO PLOT /////////////////////////////////////
export class LiTableChartConfigVulcanoPlot extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.VULCANO_PLOT;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart(
      'vulcano-plot',
      {
        series: series,
        x_threshold: options.additionalFields.xThreshold,
        y_threshold: options.additionalFields.yThreshold,
      },
      options
    );
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
    return this.createMultipleSeriesForXAndY(sheet, selectionRange);
  }

  getSelectSerieConfig(serie: SpSheetChart2dSerieSelectionForm): SpSpreadsheetChartSerieSelectionInput {
    return {
      serie: serie,
      mode: 'full',
      ySelectionMode: 'multi',
      xSelectionMode: 'multi',
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
export class LiTableChartConfigBarPlot extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.BAR_PLOT;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart('bar-plot', { series: series }, options);
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
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
export class LiTableChartConfigStackedBarPlot extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.STACKED_PLOT;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart(
      'stack-bar-plot',
      {
        series: series,
        normalize: options.additionalFields.normalize,
      },
      options
    );
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
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
export class LiTableChartConfigHistogram extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.HISTOGRAM;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart(
      'histogram',
      {
        series: series,
        nbins: options.additionalFields.nbOfBins,
        mode: options.additionalFields.histogramMode,
      },
      options
    );
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
    return this.createSingleSelectionForY(selectionRange);
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return ['nbOfBins', 'histogramMode', 'xAxisLabel', 'yAxisLabel'];
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
export class LiTableChartConfigBoxPlot extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.BOX_PLOT;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart('box-plot', { series: series }, options);
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
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
export class LiTableChartConfigHeatMap extends LiTableChart2dConfig {
  getChartType(): ChChartType {
    return ChChartType.HEAT_MAP;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.generate2dChart('heatmap', { serie: series[0] }, options);
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
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
export class LiTableChartConfigVennDiagram extends LiTableChartConfig {
  getChartType(): ChChartType {
    return ChChartType.VENN_DIAGRAM;
  }

  generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): Observable<FlOverlayRef> {
    return this.callChartOnTable('venn-diagram', { series: series }, options);
  }

  createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
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
