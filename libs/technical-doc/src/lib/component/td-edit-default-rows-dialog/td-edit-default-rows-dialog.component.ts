import { Component, inject, OnInit, signal } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlDynamicFormArrayConfig, FlDynamicFormHelper } from '@monorepo/front-core-lib/fl-dynamic-field';

import { TdConfig } from '../../model/td-config.class';
import { TdParamSpecs, TdParamSpecsValues } from '../../model/td-config-spec.class';

export interface TdEditDefaultRowsDialogInput {
  title: string;
  /** Sub-specs (columns) of the param set being configured */
  specs: TdParamSpecs;
  /** Current preset rows (partial rows keyed by inner-spec key) */
  rows: TdParamSpecsValues[];
}

/**
 * Dialog to define the preset (default) rows of a param set.
 * Renders the param set's own sub-specs as an editable form array, so the user
 * fills/adds/removes preset rows with the exact field widgets the end form uses.
 */
@Component({
  selector: 'td-edit-default-rows-dialog',
  templateUrl: './td-edit-default-rows-dialog.component.html',
  standalone: false,
})
export class TdEditDefaultRowsDialogComponent implements OnInit {
  private dialogRef = inject<MatDialogRef<TdEditDefaultRowsDialogComponent>>(MatDialogRef);
  data = inject<TdEditDefaultRowsDialogInput>(MAT_DIALOG_DATA);

  readonly arrayConfig = signal<FlDynamicFormArrayConfig | null>(null);
  formArray: UntypedFormArray;

  ngOnInit(): void {
    const config = TdConfig.fromSpecs(this.data.specs);
    const formGpConfig = config.getDynamicFormFieldsConfig();

    const arrayConfig: FlDynamicFormArrayConfig = {
      controlType: 'formArray',
      formGpConfig,
      minSize: 0,
      newElementDefaultValue: config.getDefaultConfig(),
    };

    this.arrayConfig.set(arrayConfig);
    this.formArray = FlDynamicFormHelper.generateFormArray(arrayConfig, this.data.rows ?? []);
  }

  save(): void {
    this.dialogRef.close(this.formArray.getRawValue() as TdParamSpecsValues[]);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
