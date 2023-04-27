import {SpSheetMultiSelection} from '../model/selection/sp-sheet-multi-selection.class';
import {SpSheet} from '../model/sp-sheet.class';
import {AbstractControl, ValidatorFn} from '@angular/forms';
import {SpSpreadsheetHelper} from './sp-spreadsheet.helper';
import {SpSheetSingleSelection, SpSheetSingleSelectionFull} from '../model/selection/sp-sheet-single-selection.class';
import {FlTranslateService} from '@monorepo/front-core-lib';

/**
 * Class linked to {@link SpSheetChartSerieSelectionComponent} to help handle different
 * chart types
 */
export class SpSpreadsheetChartSelectionHelper {


  public static getDefaultSerieName(index: number): string {
    return FlTranslateService.getInstance().translate('spSpreadsheet.chart_serie') + ' ' + (index + 1);
  }


  /**
   * Validator to check single selection
   * Error invalidFormat if string format is invalid
   * Error selectionOutOfBound is selection is out of bound (pass the name of the coord problem)
   * @private
   */
  public static singleSelectionValidator(sheet: SpSheet): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      if (!SpSpreadsheetHelper.getRegexForSingleSelection().test(control.value)) {
        return {invalidFormat: 'A1:B2'};
      }

      const selection: SpSheetSingleSelection = SpSheetSingleSelectionFull.fromString(sheet, control.value);

      return SpSpreadsheetChartSelectionHelper.checkSelectOutOfBound(sheet, selection);
    };
  }


  /**
   * Validator to check multiple selection
   * Error invalidFormat if string format is invalid
   * Error selectionOutOfBound is selection is out of bound
   * @private
   */
  public static multipleSelectionValidator(sheet: SpSheet): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }

      if (!SpSpreadsheetHelper.getRegexForMultipleSelection().test(control.value)) {
        return {invalidFormat: 'A1:B2,D1:D2'};
      }

      const selections: SpSheetMultiSelection = SpSheetMultiSelection.fromString(sheet, control.value);

      for (const selection of selections.selections) {
        const outOfBound = SpSpreadsheetChartSelectionHelper.checkSelectOutOfBound(sheet, selection);

        if (outOfBound != null) {
          return outOfBound;
        }

      }

      return null;
    };
  }

  // Check if a selection is out of bound
  private static checkSelectOutOfBound(sheet: SpSheet, selection: SpSheetSingleSelection): any {

    // retrieve max cell coords for a cleaner error message
    const maxCellCoord: string = SpSpreadsheetHelper.coordToString({
      row: sheet.totalRowsCount - 1,
      column: sheet.totalColumnsCount - 1
    });

    if (!sheet.coordIsValid(selection.from)) {
      return {
        selectionOutOfBound: {
          errorSelection: SpSpreadsheetHelper.coordToString(selection.from),
          maxSelection: maxCellCoord
        }
      };
    }

    if (!sheet.coordIsValid(selection.to)) {
      return {
        selectionOutOfBound: {
          errorSelection: SpSpreadsheetHelper.coordToString(selection.to),
          maxSelection: maxCellCoord
        }
      };
    }

    return null;
  }
}
