import { Component, inject, OnInit } from '@angular/core';
import { FlDynamicFieldConfigService, FlTranslatableText } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { TdParamSpecs } from '@monorepo/technical-doc';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LabConfig } from '../../../../model/entities/lab-config.entity';
import { LabProcessDynamicFieldConfig } from '../../../lab-config-core/lab-process-dynamic-field-config.service';
import {
  LabConfigureSpecsForm,
  LabConfigureSpecsFormComponent,
} from '../../../lab-config-core/component/lab-configure-specs-form/lab-configure-specs-form.component';

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
    providers: [
        // configure the dynamic field to support tags and other custom fields
        { provide: FlDynamicFieldConfigService, useClass: LabProcessDynamicFieldConfig },
    ],
    standalone: false
})
export class LabQuickConfigureProcessDialogComponent implements OnInit {
  input: LabQuickConfigureProcessDialogInput = inject(MAT_DIALOG_DATA);

  formGp: FormGroup<LabConfigureSpecsForm>;
  processConfig: LabConfig;

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
    this.processConfig = LabConfig.fromSpecs(specs, null);
    this.formGp = LabConfigureSpecsFormComponent.buildFormGroup(this.processConfig);

    this.getIsLoading = false;
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(LabConfigureSpecsFormComponent.buildValues(this.formGp));
    }
  }
}
