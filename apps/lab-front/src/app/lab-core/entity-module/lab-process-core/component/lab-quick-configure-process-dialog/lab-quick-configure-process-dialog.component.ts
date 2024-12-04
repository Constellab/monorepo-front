import { Component, inject, OnInit } from '@angular/core';
import {
  FlDynamicFormAbstractControl,
  FlDynamicFormHelper,
  FlTranslatableText,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabConfig } from '../../../../model/entities/lab-config.entity';

export interface LabQuickConfigureProcessDialogInput {
  title: FlTranslatableText;
  helpText?: FlTranslatableText;
  specs$: Observable<TdParamSpecs>;
}

/**
 * Dialog to load a process configuration, and configure it.
 * This dialog is independent of playground
 * Then trigger an action (like creating a scenario)
 */
@Component({
  selector: 'lab-quick-configure-process-dialog',
  templateUrl: './lab-quick-configure-process-dialog.component.html',
  styleUrl: './lab-quick-configure-process-dialog.component.scss',
})
export class LabQuickConfigureProcessDialogComponent implements OnInit {
  input: LabQuickConfigureProcessDialogInput = inject(MAT_DIALOG_DATA);

  formGp: UntypedFormGroup;
  dataConfig: FlDynamicFormAbstractControl;

  getIsLoading: boolean = true;

  private dialogRef = inject(MatDialogRef);

  ngOnInit(): void {
    this.getSpecs();
  }

  private getSpecs(): void {
    this.input.specs$.subscribe({
      next: (specs: TdParamSpecs) => this.getSpecsSuccess(specs),
      error: () => (this.getIsLoading = false),
    });
  }

  private getSpecsSuccess(specs: TdParamSpecs): void {
    // TODO TO improve once fix from @vfoex is merged
    const labConfig = LabConfig.fromSpecs(specs, null);
    this.dataConfig = labConfig.getDynamicFormFieldsConfig();
    this.formGp = FlDynamicFormHelper.generateFormGroup(this.dataConfig);

    this.getIsLoading = false;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }
}
