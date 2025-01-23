import { SpSpreadsheetChartSelectionHelper } from '../../utils/sp-spreadsheet-chart-selection.helper';
import {
  SpSheetChart2dSerieSelectionForm,
  SpSheetChartSelectionFormAdditional,
  SpSheetSelectionRange,
} from './sp-sheet-chart-selection-form.class';
import { SpCellsRange } from '../selection/sp-cells-range.class';
import { SpSheet } from '../sp-sheet.class';
import { Observable } from 'rxjs';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { ChChartType } from '@monorepo/chart';

/**
 * Mode for the selection
 * Single, it generates a string based on current single selection (like A1:C3)
 * Multi, it generates a multi selection separated with ',' (like A1:B3,D1:D4)
 */
export type SpSheetSelectionMode = 'single' | 'multi';

// on onlyY mode, there is no input to select X abscisse data
export type SpSpreadsheetSelectSerieMode = 'full' | 'onlyY';

export interface SpSpreadsheetChartSerieSelectionInput {
  mode: SpSpreadsheetSelectSerieMode;
  serie: SpSheetChart2dSerieSelectionForm;
  ySelectionMode: SpSheetSelectionMode;
  xSelectionMode?: SpSheetSelectionMode;
}

export interface SpSpreadsheetGenerateChartOptions {
  additionalFields: SpSheetChartSelectionFormAdditional;
  sheet: SpSheet;
  contextMenuItems: FlMenuDynamic[];
  // method that can be called to open the selection update portal
  updateSelection: () => void;
}

/**
 * Config for the form to select values from spreadsheet to then generate a chart type from the sheet
 */
export abstract class SpSheetChartConfig {
  public abstract getChartType(): ChChartType;

  public abstract generateChart(
    series: SpSheetChart2dSerieSelectionForm[],
    options: SpSpreadsheetGenerateChartOptions
  ): FlOverlayRef | Observable<FlOverlayRef>;

  abstract createSeriesFromDataRange(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[];

  abstract getSelectSerieConfig(
    serie: SpSheetChart2dSerieSelectionForm
  ): SpSpreadsheetChartSerieSelectionInput;

  getNbMaxOfSeries(): number {
    return Infinity;
  }

  getAdditionalFieldsName(): (keyof SpSheetChartSelectionFormAdditional)[] {
    return [];
  }

  /**
   * Create multiple series from a selection range. It only creates y selection
   * @param sheet
   * @param selectionRange
   * @param serieIndex specific case to start serie index with an offset
   * @protected
   */
  protected createMultipleSeriesForY(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange,
    serieIndex: number = 0
  ): SpSheetChart2dSerieSelectionForm[] {
    if (selectionRange.type === 'range') {
      const series: SpSheetChart2dSerieSelectionForm[] = [];

      let i = serieIndex;
      for (const selection of selectionRange.selection) {
        // split each ranch by column
        const columnRanges = SpCellsRange.MultipleFromCellCoordsRange(selection).splitToColumnRanges();

        for (const columnRange of columnRanges) {
          series.push({
            name: this.getColumnSerieName(sheet, columnRange.from.column, i),
            y: { type: 'range', selection: [columnRange.toCoords()] },
          });
          i++;
        }
      }
      return series;
    } else {
      return selectionRange.selection.map((selection) => ({
        name: selection,
        y: { type: 'columns', selection: [selection] },
      }));
    }
  }

  /**
   * Create multiple series from a selection range. If there is series, it takes the first one as x for other series
   * @protected
   */
  protected createMultipleSeriesForXAndY(
    sheet: SpSheet,
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
    // split y selection by column
    const series = this.createMultipleSeriesForY(sheet, selectionRange);

    if (series.length > 1) {
      // re-retrieve the serie with correct index (because first serie is x
      const ySeries = this.createMultipleSeriesForY(sheet, selectionRange, -1);
      // Extract the first selection as x selection
      // noinspection JSSuspiciousNameCombination
      const x: SpSheetSelectionRange = ySeries.shift().y;

      // add the x to each serie and reset name
      ySeries.forEach((serie) => {
        serie.x = x;
      });
      return ySeries;
    } else {
      // if there is only one selection, use it as a serie with Y
      return series;
    }
  }

  protected createSingleSelectionForY(
    selectionRange: SpSheetSelectionRange
  ): SpSheetChart2dSerieSelectionForm[] {
    return [
      {
        name: SpSpreadsheetChartSelectionHelper.getDefaultSerieName(0),
        y: selectionRange,
      },
    ];
  }

  private getColumnSerieName(sheet: SpSheet, columnIndex: number, serieIndex: number): string {
    const columnInfo = sheet.getColumnInfo(columnIndex);
    if (columnInfo.name) {
      return columnInfo.name;
    }

    return SpSpreadsheetChartSelectionHelper.getDefaultSerieName(serieIndex);
  }
}
