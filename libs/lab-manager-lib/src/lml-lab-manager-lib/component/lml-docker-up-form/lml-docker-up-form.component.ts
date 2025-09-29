import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface LmlDockerUpFormInput {
  mode: 'start' | 'restart';
}

/**
 * Form dialog to select options before running a compose up or restart
 */
@Component({
  selector: 'lml-docker-up-form',
  templateUrl: './lml-docker-up-form.component.html',
  styleUrls: ['./lml-docker-up-form.component.scss'],
  standalone: false,
})
export class LmlDockerUpFormComponent {
  formGp = new FormBuilder().group({
    updateContainers: [true],
    destroyContainers: [false],
  });

  private input: LmlDockerUpFormInput = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef);

  submit(): void {
    if (this.formGp.valid) {
      this.dialogRef.close(this.formGp.getRawValue());
    }
  }

  get isRestart(): boolean {
    return this.input.mode === 'restart';
  }

  get title(): string {
    return this.input.mode === 'start'
      ? 'lml.lab_manager_compose_up_form'
      : 'lml.lab_manager_compose_restart_form';
  }

  get submitLabel(): string {
    return this.input.mode === 'start' ? 'lml.up_services' : 'lml.restart_services';
  }
}
