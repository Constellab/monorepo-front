import { Component, inject, OnInit } from '@angular/core';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { FlDynamicFormAbstractControl, FlDynamicFormHelper } from '@monorepo/front-core-lib/fl-dynamic-field';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AbstractControl } from '@angular/forms';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlFormHelper } from '@monorepo/front-core-lib/fl-core';

export interface FlDynamicFieldFormDialogInput {
  title: FlTranslatableText;
  helpText?: FlTranslatableText;
  config: FlDynamicFormAbstractControl;
  data?: any;
  submit: (data: any) => Observable<any>;
  successMessage?: FlTranslatableText;
}

export interface FlDynamicFieldFormDialogOutput {
  submitted: true;
  data: any;
  formValue: any;
}

/**
 * Component to generate a dynamic form dialog and call a submit function
 */
@Component({
  selector: 'fl-dynamic-field-form-dialog',
  standalone: false,
  templateUrl: './fl-dynamic-field-form-dialog.component.html',
  styleUrl: './fl-dynamic-field-form-dialog.component.scss',
})
export class FlDynamicFieldFormDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef);
  private snackBarService = inject(FlSnackBarService);

  data: FlDynamicFieldFormDialogInput = inject(MAT_DIALOG_DATA);

  isLoading: boolean = false;
  formGp: AbstractControl;

  ngOnInit(): void {
    this.formGp = FlDynamicFormHelper.generateForm(this.data.config, this.data.data);
  }

  submit(): void {
    if (this.formGp.valid) {
      this.isLoading = true;
      const formValue = this.formGp.getRawValue();
      this.data.submit(formValue).subscribe({
        next: (result) => this.onSuccess(result, formValue),
        error: () => (this.isLoading = false),
      });
    } else {
      FlFormHelper.markAllAsTouched(this.formGp);
    }
  }

  private onSuccess(result: any, formValue: any): void {
    if (this.data.successMessage) {
      this.snackBarService.openSuccessMessage(this.data.successMessage);
    }
    this.dialogRef.close({
      submitted: true,
      data: result,
      formValue: formValue,
    } as FlDynamicFieldFormDialogOutput);
    this.isLoading = false;
  }
}
