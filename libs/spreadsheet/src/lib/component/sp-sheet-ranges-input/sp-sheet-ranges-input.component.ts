import { ChangeDetectionStrategy,Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, NgControl, UntypedFormGroup } from '@angular/forms';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { Observable, of, Subscription } from 'rxjs';

import { SpSheetSelectionRange } from '../../model/chart/sp-sheet-chart-selection-form.class';
import { SpCellsMultipleRange } from '../../model/selection/sp-cells-multiple-range.class';
import { SpSheetSingleSelection } from '../../model/selection/sp-sheet-single-selection.class';
import { SpSpreadsheetState } from '../../state/sp-spreadsheet.state';
import { SpSpreadsheetChartSelectionHelper } from '../../utils/sp-spreadsheet-chart-selection.helper';

interface SpSpreadsheetRangeForm {
  type: 'range' | 'columns';
  rangeSelection?: string | null;
  columnsSelection?: string[] | null;
}

/**
 * Component for chart generation. It is a NgModel component to manage multiple range selection
 * It supports multiple mode :
 *  - Range selection
 *  - Columns selection
 */
@Component({
  selector: 'sp-sheet-ranges-input',
  templateUrl: './sp-sheet-ranges-input.component.html',
  styleUrls: ['./sp-sheet-ranges-input.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: SpSheetRangesInputComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SpSheetRangesInputComponent
  extends FlFormFieldDirective<SpSpreadsheetRangeForm | null, SpSheetSelectionRange | null>
  implements OnInit, OnDestroy
{
  private state = inject(SpSpreadsheetState);

  @Input() placeholder: string;

  @Input() initialSelection: SpSheetSingleSelection;

  @Input() selectionListenerGroup: string;

  @Input() rangeMode: 'single' | 'multi' = 'multi';

  @Output() selectionChange: EventEmitter<SpSheetSelectionRange | null> = new EventEmitter();

  formGp: UntypedFormGroup;

  columnSearchFunc: (searchString: string) => Observable<string[]>;

  private subscription: Subscription;

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  ngOnInit(): void {
    this.initForm();

    this.columnSearchFunc = (searchString) => of(this.state.currentSheet.searchColumns(searchString));

    if (this.initialSelection) {
      this.onNewSelection(this.initialSelection);
    }

    // use a timeout to prevent change detection error
    setTimeout(() => {
      this.formGp.valueChanges.subscribe((value) => this.setAndEmitValue(value));
    }, 0);
  }

  private initForm(): void {
    const rangeValidation =
      this.rangeMode === 'multi'
        ? SpSpreadsheetChartSelectionHelper.multipleSelectionValidator(this.state.currentSheet)
        : SpSpreadsheetChartSelectionHelper.singleSelectionValidator(this.state.currentSheet);
    // init form Group here, because the writeValue can be called before ngOnInit
    this.formGp = new FormBuilder().group({
      type: ['range'],
      rangeSelection: [null, [rangeValidation]],
      columnsSelection: [null],
    });

    if (this.value != null) {
      this.formGp.patchValue(this.value);
    }
  }

  callChangeEvent(value: SpSheetSelectionRange | null): void {
    this.selectionChange.next(value);
  }

  onDisableChange(): void {}

  writeValue(obj: SpSheetSelectionRange | null): void {
    this.value = this.convertOuterToInner(obj);

    if (!obj) return;

    const value = this.value;
    if (this.formGp && value != null) {
      this.formGp.patchValue(value);
    }
  }

  get mode(): 'range' | 'columns' {
    return this.formGp.value.type;
  }

  protected convertOuterToInner(outerValue: SpSheetSelectionRange | null): SpSpreadsheetRangeForm | null {
    if (!outerValue) return null;

    if (outerValue.type === 'range') {
      const multipleRange = SpCellsMultipleRange.fromCellCoordsRange(outerValue.selection);
      return {
        type: 'range',
        rangeSelection: multipleRange.toString(),
        columnsSelection: null,
      };
    } else {
      return {
        type: 'columns',
        columnsSelection: outerValue.selection,
        rangeSelection: null,
      };
    }
  }

  protected convertInnerToOuter(innerValue: SpSpreadsheetRangeForm | null): SpSheetSelectionRange | null {
    if (!innerValue || this.formGp.invalid) return null;

    if (innerValue.type === 'range') {
      const rangeControl = this.formGp.get('rangeSelection');
      if (!innerValue.rangeSelection || rangeControl == null || rangeControl.invalid) return null;
      const multipleRange = SpCellsMultipleRange.fromString(innerValue.rangeSelection);
      return {
        type: 'range',
        selection: multipleRange.toCoords(),
      };
    } else {
      if (!innerValue.columnsSelection) return null;
      return {
        type: 'columns',
        selection: innerValue.columnsSelection,
      };
    }
  }

  onNewSelection(selection: SpSheetSingleSelection | null): void {
    if (selection == null) return;

    this.writeValue(selection.toSpSheetSelectionRange());
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
