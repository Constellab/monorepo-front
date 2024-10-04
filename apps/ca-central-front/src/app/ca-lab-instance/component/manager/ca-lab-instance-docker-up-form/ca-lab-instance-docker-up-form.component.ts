import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

export interface CaLabInstanceDockerUpFormInput {
  mode: 'start' | 'restart';
}

/**
 * Form dialog to select options before running a compose up or restart
 */
@Component({
  selector: 'ca-lab-instance-docker-up-form',
  templateUrl: './ca-lab-instance-docker-up-form.component.html',
  styleUrls: ['./ca-lab-instance-docker-up-form.component.scss']
})
export class CaLabInstanceDockerUpFormComponent {

  formGp = new FormBuilder().group({
    updateContainers: [true],
    pruneSystem: [true],
    destroyContainers: [false]
  });

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaLabInstanceDockerUpFormInput,
              private dialogRef: MatDialogRef<CaLabInstanceDockerUpFormComponent>) {
  }

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }

  get isRestart(): boolean {
    return this.input.mode === 'restart';
  }

  get title(): string {
    return this.input.mode === 'start' ? 'lab_manager_compose_up_form' : 'lab_manager_compose_restart_form';
  }
}
