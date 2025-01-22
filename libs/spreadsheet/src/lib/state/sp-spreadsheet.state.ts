import { Injectable, OnDestroy, inject } from '@angular/core';
import { SpSpreadsheet } from '../model/sp-spreadsheet.class';
import { SpSheet } from '../model/sp-sheet.class';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SpSpreadsheetFactory } from '../utils/sp-spreadsheet.factory';
import { SpCell } from '../model/sp-cell.class';
import { SpSheetHeader, SpSheetRow } from '../model/sp-sheet-headers.class';
import { SpSheetChartConfig } from '../model/chart/sp-sheet-chart-config.class';
import {
  SpSheetLocalChartConfigBarPlot,
  SpSheetLocalChartConfigBoxPlot,
  SpSheetLocalChartConfigHeatMap,
  SpSheetLocalChartConfigHistogram,
  SpSheetLocalChartConfigLinePlot,
  SpSheetLocalChartConfigScatterPlot,
  SpSheetLocalChartConfigStackedBarPlot,
  SpSheetLocalChartConfigVulcanoPlot,
} from '../model/chart/sp-sheet-chart-local-config.class';
import { ChChartPortalService, ChChartType } from '@monorepo/chart';

/**
 * Unique state shared across the spreadsheet to store the current spreadsheet
 */
@Injectable()
export class SpSpreadsheetState implements OnDestroy {
  private chartPortalService = inject(ChChartPortalService);

  private _spreadsheet: SpSpreadsheet;

  private lastSheetId: number = 0;

  // list of sheet of cell objects
  private cellObjectSheets: Map<number, SpSheet> = new Map();

  public readOnly: boolean = false;

  private chartConfigs: SpSheetChartConfig[];

  public init(spreadsheet: SpSpreadsheet, readOnly: boolean, chartConfigs: SpSheetChartConfig[]): void {
    this._spreadsheet = spreadsheet;
    this.lastSheetId = spreadsheet.sheets.length;
    this.readOnly = readOnly;
    this.chartConfigs = chartConfigs ?? this.getDefaultChartConfigs();
  }

  public get spreadsheet(): SpSpreadsheet {
    return this._spreadsheet;
  }

  public getSheet(id: number): SpSheet {
    return this._spreadsheet.getSheet(id);
  }

  ///////////////////////// CURRENT SHEET /////////////////////////
  public get currentSheet(): SpSheet {
    return this._spreadsheet.currentSheet;
  }

  public get currentSheet$(): Observable<SpSheet> {
    return this._spreadsheet.getCurrentSheet$();
  }

  // emit the columns
  // each time the current sheet change or the columns of current sheet change
  // it's working well thanks to the behaviour subjects
  public getCurrentSheetColumns$(): Observable<SpSheetHeader[]> {
    return this.currentSheet$.pipe(mergeMap((sheet) => sheet.getColumns$()));
  }

  // emit the rows
  // each time the current sheet change or the rows of current sheet change
  // it's working well thanks to the behaviour subjects
  public getCurrentSheetRows$(): Observable<SpSheetRow[]> {
    return this.currentSheet$.pipe(mergeMap((sheet) => sheet.getRows$()));
  }

  /**
   * For cell object, this open the cell value in a new sheet
   */
  public openCellInNewSheet(cell: SpCell): void {
    // check if the sheet for this cell already exists
    const sheet: SpSheet = this.cellObjectSheets.get(cell.id);
    if (sheet != null) {
      this._spreadsheet.selectSheet(sheet.id);
      return;
    }

    // if this is a new sheet
    const sheetName: string = SpSpreadsheetFactory.getSheetNameFromId(++this.lastSheetId);
    const newSheet = SpSpreadsheetFactory.fromAny(cell.value, sheetName);
    this.cellObjectSheets.set(cell.id, newSheet);
    this._spreadsheet.addSheet(newSheet);
  }

  //////////////////////////////////// CHART ////////////////////////////////////
  public getChartConfigs(): SpSheetChartConfig[] {
    return this.chartConfigs;
  }

  public getChartConfig(chartType: ChChartType): SpSheetChartConfig {
    return this.chartConfigs.find((config) => config.getChartType() === chartType);
  }

  private getDefaultChartConfigs(): SpSheetChartConfig[] {
    return [
      new SpSheetLocalChartConfigLinePlot(this.chartPortalService),
      new SpSheetLocalChartConfigScatterPlot(this.chartPortalService),
      new SpSheetLocalChartConfigVulcanoPlot(this.chartPortalService),
      new SpSheetLocalChartConfigBarPlot(this.chartPortalService),
      new SpSheetLocalChartConfigStackedBarPlot(this.chartPortalService),
      new SpSheetLocalChartConfigHistogram(this.chartPortalService),
      new SpSheetLocalChartConfigBoxPlot(this.chartPortalService),
      new SpSheetLocalChartConfigHeatMap(this.chartPortalService),
    ];
  }

  //////////////////////////////////// OTHER ////////////////////////////////////

  ngOnDestroy(): void {
    this._spreadsheet.destroy();
  }
}
