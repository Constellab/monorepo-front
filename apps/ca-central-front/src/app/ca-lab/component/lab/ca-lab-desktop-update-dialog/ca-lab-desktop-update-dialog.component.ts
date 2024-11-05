import { Component, Inject, OnInit } from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaLabDesktopForm } from '../../../../ca-core/model/entities/lab/ca-lab.form';

export type LabDesktopUpdateDialogInput = CaLabDesktopForm;

/**
 * Accessible by lab owner to update lab information
 */
@Component({
  selector: 'ca-lab-desktop-update-dialog',
  templateUrl: './ca-lab-desktop-update-dialog.component.html',
  styleUrls: ['./ca-lab-desktop-update-dialog.component.scss'],
})
export class CaLabDesktopUpdateDialogComponent implements OnInit {
  formGp: FormGroup;

  maxNameLength = CaLab.MAX_NAME_LENGTH;

  isLoading: boolean = false;

  constructor(
    private snackbarService: FlSnackBarService,
    @Inject(MAT_DIALOG_DATA) private input: LabDesktopUpdateDialogInput,
    private labService: CaLabService,
    private dialogRef: MatDialogRef<CaLabDesktopUpdateDialogComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.formGp = this.formBuilder.group({
      id: [this.input.id, Validators.required],
      name: [this.input.name, [Validators.required]],
      desktopPlatform: [this.input.desktopPlatform],
    });
  }

  submit(): void {
    if (!this.isLoading && this.formGp.valid) {
      this.isLoading = true;
      this.labService.updateLabDesktop(this.formGp.value).subscribe({
        next: (lab) => this.onSuccess(lab),
        error: () => (this.isLoading = false),
      });
    }
  }

  private onSuccess(lab: CaLab): void {
    this.snackbarService.openSuccessMessage({ text: 'lab_name_updated', translateText: true });
    this.isLoading = false;
    this.dialogRef.close(lab);
  }
}
