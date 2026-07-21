import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FL_PORTAL_DATA } from '@monorepo/front-core-lib/fl-portal';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';

import { SpSpreadsheetChartSerieSelectionInput } from '../../model/chart/sp-sheet-chart-config.class';
import { SpSheetChart2dSerieSelectionForm } from '../../model/chart/sp-sheet-chart-selection-form.class';

/**
 * Portal to select one serie during chart selection
 */
@Component({
  selector: 'sp-sheet-chart-serie-selection',
  templateUrl: './sp-sheet-chart-serie-selection.component.html',
  styleUrls: ['./sp-sheet-chart-serie-selection.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SpSheetChartSerieSelectionComponent implements OnInit {
  private overlayRef = inject(FlOverlayRef);

  formGp: UntypedFormGroup;

  input: SpSpreadsheetChartSerieSelectionInput;

  constructor() {
    const input = inject<SpSpreadsheetChartSerieSelectionInput>(FL_PORTAL_DATA);

    this.input = input;
  }

  ngOnInit(): void {
    this.initForm();

    if (this.input.serie != null) {
      this.formGp.patchValue(this.input.serie);
    }
  }

  private initForm(): void {
    this.formGp = new FormBuilder().group({
      name: [null, Validators.required],
      y: [null, Validators.required],
    });

    if (this.input.mode === 'full') {
      this.formGp.addControl('x', new FormControl(null));
    }
  }

  submit(): void {
    if (this.formGp.valid) {
      const value: SpSheetChart2dSerieSelectionForm = this.formGp.getRawValue();

      this.overlayRef.dispose(value);
    }
  }
}
