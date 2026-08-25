import { ChChartHistogramMode, ChChartType } from '@monorepo/chart';

import { SpSheetSingleSelection } from '../selection/sp-sheet-single-selection.class';
import { SpCellCoordRange } from '../sp-cell-coord.class';

export type SpSpreadsheetChartSelectionInput =
  | SpSpreadsheetChartSelectionInputCreate
  | SpSpreadsheetChartSelectionInputUpdate;

// data for when selecting data for a new chart
export interface SpSpreadsheetChartSelectionInputCreate {
  mode: 'create';
  currentSelection: SpSheetSingleSelection | null;
}

// data for when re-selecting data for an existing chart chart
// it contain the complete selection object
export interface SpSpreadsheetChartSelectionInputUpdate {
  mode: 'update';
  selection: SpSheetChartSelectionForm;
}

export interface SpSheetChartSelectionResult {
  mode: 'create' | 'update';
  formValue: SpSheetChartSelectionForm;
}

/**
 * Type used in the form of {@link SpSheetChartSelectionComponent}
 */
export interface SpSheetChartSelectionForm {
  id: symbol;

  // type of the chart
  chartType: ChChartType;

  // global data range form a multiple selection
  dataRange?: SpSheetSelectionRange | null;

  // list of series
  series: SpSheetChart2dSerieSelectionForm[];

  additionalFields: SpSheetChartSelectionFormAdditional;
}

export type SpSheetSelectionRange =
  | {
      type: 'range';
      selection: SpCellCoordRange[];
    }
  | {
      type: 'columns';
      // selected columns
      selection: string[];
    };

export interface SpSheetChartSelectionFormAdditional {
  // for the Histogram
  nbOfBins?: number | null;
  density?: boolean | null;
  histogramMode?: ChChartHistogramMode | null;
  // for the stack bar
  normalize?: boolean | null;
  // for 2d charts
  xAxisLabel?: string | null;
  yAxisLabel?: string | null;
  // for vulcano plot
  xThreshold?: number | null;
  yThreshold?: number | null;
}

/**
 * Form value of a serie selection
 */
export interface SpSheetChartSerieSelectionForm {
  name: string;
  y: SpSheetSelectionRange | null; // string of the selection
}

/**
 * Form value of a serie selection where X is selectable
 */
export interface SpSheetChart2dSerieSelectionForm extends SpSheetChartSerieSelectionForm {
  x?: SpSheetSelectionRange | null; // string of the x selection
}
