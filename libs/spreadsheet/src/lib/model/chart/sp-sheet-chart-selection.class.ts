import { ChChart2dDatum, ChChartConfig, ChChartSerie } from '@monorepo/chart';
import { ClHelpService, ClNumberHelper } from '@monorepo/core-lib';

import { SpSheetMultiSelection } from '../selection/sp-sheet-multi-selection.class';
import { SpSheetSelection } from '../selection/sp-sheet-selection.class';
import { SpSheet } from '../sp-sheet.class';
import {
  SpSheetChart2dSerieSelectionForm,
  SpSheetSelectionRange,
} from './sp-sheet-chart-selection-form.class';

/**
 * Object to store the chart selection and contain a method to export the selection to series
 */
export abstract class SpSheetChartSelection {
  protected constructor(protected sheet: SpSheet) {}

  /**
   * Method to convert the selection to a multiple series
   */
  public abstract exportToChart(): ChChartConfig;

  protected getMultiSelectionFromSelectionRange(
    selection: SpSheetSelectionRange | null | undefined
  ): SpSheetMultiSelection | null {
    if (selection == null || ClHelpService.isNullOrEmpty(selection)) {
      return null;
    }
    return SpSheetMultiSelection.fromSelectionRange(this.sheet, selection);
  }

  /**
   * Convert the selections values to 2d datum with x = index of the value and y = value as number
   * @param selection
   * @private
   */
  protected convertSelectionTo2dDatum(selection: SpSheetSelection | null): ChChart2dDatum[] {
    // create a chart datum for each values
    return this.getSelectionValues(selection).map((value, index) => new ChChart2dDatum(index, value));
  }

  /**
   * Convert the selections values to 2d datum with x = xData and y = value as number
   */
  protected convertSelectionTo2dDatumWithXData(
    xSelection: SpSheetSelection | null,
    ySelection: SpSheetSelection | null
  ): ChChart2dDatum[] {
    const xValues: number[] = this.getSelectionValues(xSelection);
    const yValues: number[] = this.getSelectionValues(ySelection);
    const limit = Math.min(xValues.length, yValues.length);
    // create a chart datum for each value (where x and y exists
    const data: ChChart2dDatum[] = [];
    for (let i = 0; i < limit; i++) {
      data.push(new ChChart2dDatum(xValues[i], yValues[i]));
    }
    return data;
  }

  /**
   * Convert a formSelection serie to a chart serie including x values if provided
   * @param formSelection
   * @protected
   */
  protected convert2DFormSelectionToChartSerie(
    formSelection: SpSheetChart2dSerieSelectionForm
  ): ChChartSerie<any> {
    const ySelection: SpSheetSelection | null = this.getMultiSelectionFromSelectionRange(formSelection.y);

    if (!ClHelpService.isNullOrEmpty(formSelection.x)) {
      const xSelection: SpSheetSelection | null = this.getMultiSelectionFromSelectionRange(
        formSelection.x
      );
      return new ChChartSerie<any>(
        this.convertSelectionTo2dDatumWithXData(xSelection, ySelection),
        formSelection.name
      );
    } else {
      return new ChChartSerie<any>(this.convertSelectionTo2dDatum(ySelection), formSelection.name);
    }
  }

  /**
   * return the selection values as numbers, it excludes the value that are not numbers
   */
  protected getSelectionValues(selection: SpSheetSelection | null): number[] {
    if (selection == null) return [];

    const values: any[] = selection.getCellsValuesFlat();

    // convert the values to number if possible
    // the cast is needed because the chart datum classes declare x/y as number while they
    // handle null values (see their 'valid' getter)
    return values.map((value) => ClNumberHelper.fromString(value) as number);
  }
}
