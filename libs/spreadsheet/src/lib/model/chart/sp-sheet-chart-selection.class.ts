import { SpSheet } from '../sp-sheet.class';
import { SpSheetMultiSelection } from '../selection/sp-sheet-multi-selection.class';
import { SpSheetSelection } from '../selection/sp-sheet-selection.class';
import { ClHelpService, ClNumberHelper } from '@monorepo/core-lib';
import {
  SpSheetChart2dSerieSelectionForm,
  SpSheetSelectionRange,
} from './sp-sheet-chart-selection-form.class';
import { ChChart2dDatum, ChChartConfig, ChChartSerie } from '@monorepo/chart';

/**
 * Object to store the chart selection and contain a method to export the selection to series
 */
export abstract class SpSheetChartSelection {
  protected constructor(protected sheet: SpSheet) {}

  /**
   * Method to convert the selection to a multiple series
   */
  public abstract exportToChart(): ChChartConfig;

  protected getMultiSelectionFromSelectionRange(selection: SpSheetSelectionRange): SpSheetMultiSelection {
    return !ClHelpService.isNullOrEmpty(selection)
      ? SpSheetMultiSelection.fromSelectionRange(this.sheet, selection)
      : null;
  }

  /**
   * Convert the selections values to 2d datum with x = index of the value and y = value as number
   * @param selection
   * @private
   */
  protected convertSelectionTo2dDatum(selection: SpSheetSelection): ChChart2dDatum[] {
    // create a chart datum for each values
    return this.getSelectionValues(selection).map((value, index) => new ChChart2dDatum(index, value));
  }

  /**
   * Convert the selections values to 2d datum with x = xData and y = value as number
   */
  protected convertSelectionTo2dDatumWithXData(
    xSelection: SpSheetSelection,
    ySelection: SpSheetSelection
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
    const ySelection: SpSheetSelection = this.getMultiSelectionFromSelectionRange(formSelection.y);

    if (!ClHelpService.isNullOrEmpty(formSelection.x)) {
      const xSelection: SpSheetSelection = this.getMultiSelectionFromSelectionRange(formSelection.x);
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
  protected getSelectionValues(selection: SpSheetSelection): number[] {
    const values: any[] = selection.getCellsValuesFlat();

    // convert the values to number if possible
    return values.map((value) => ClNumberHelper.fromString(value));
  }
}
