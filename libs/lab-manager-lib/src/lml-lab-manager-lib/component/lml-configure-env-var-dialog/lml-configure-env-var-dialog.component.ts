import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { LmlCustomEnvVariableDTO } from '../../model/lml-lab-manager.class';

export interface LmlConfigureEnvVarDialogInput {
  // present when editing an existing variable; absent when adding
  envVar?: LmlCustomEnvVariableDTO;
}

/**
 * Add or edit a single custom env variable (key/value). The key is read-only in edit
 * mode: it identifies the row, so changing it would be a delete + add, not an edit.
 */
@Component({
  selector: 'lml-configure-env-var-dialog',
  templateUrl: './lml-configure-env-var-dialog.component.html',
  styleUrls: ['./lml-configure-env-var-dialog.component.scss'],
  standalone: false,
})
export class LmlConfigureEnvVarDialogComponent {
  private data = inject<LmlConfigureEnvVarDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);

  readonly isEdit = this.data?.envVar != null;

  formGp = new FormBuilder().group({
    key: [
      { value: this.data?.envVar?.key ?? '', disabled: this.isEdit },
      [Validators.required, Validators.pattern(/^[A-Za-z_][A-Za-z0-9_]*$/)],
    ],
    value: [this.data?.envVar?.value ?? ''],
  });

  submit(): void {
    if (this.formGp.valid) {
      const raw = this.formGp.getRawValue();
      const envVar: LmlCustomEnvVariableDTO = { key: raw.key ?? '', value: raw.value ?? '' };
      this.dialogRef.close(envVar);
    }
  }
}
