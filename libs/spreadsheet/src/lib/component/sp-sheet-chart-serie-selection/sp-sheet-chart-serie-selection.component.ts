import { Component, Inject, OnInit } from '@angular/core';
import { SpSheetChart2dSerieSelectionForm } from '../../model/chart/sp-sheet-chart-selection-form.class';
import { FormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SpSpreadsheetChartSerieSelectionInput } from '../../model/chart/sp-sheet-chart-config.class';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib';


/**
 * Portal to select one serie during chart selection
 */
@Component({
  selector: 'sp-sheet-chart-serie-selection',
  templateUrl: './sp-sheet-chart-serie-selection.component.html',
  styleUrls: ['./sp-sheet-chart-serie-selection.component.scss']
})
export class SpSheetChartSerieSelectionComponent implements OnInit {

  formGp: UntypedFormGroup;

  input: SpSpreadsheetChartSerieSelectionInput;

  constructor(@Inject(FL_PORTAL_DATA) input: SpSpreadsheetChartSerieSelectionInput,
              private overlayRef: FlOverlayRef) {
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
      y: [null, Validators.required]
    });

    if (this.input.mode === 'full') {
      this.formGp.addControl('x',
        new FormControl(null)
      );
    }
  }

  submit(): void {
    if (this.formGp.valid) {
      const value: SpSheetChart2dSerieSelectionForm = this.formGp.getRawValue();

      this.overlayRef.dispose(value);
    }
  }

}
