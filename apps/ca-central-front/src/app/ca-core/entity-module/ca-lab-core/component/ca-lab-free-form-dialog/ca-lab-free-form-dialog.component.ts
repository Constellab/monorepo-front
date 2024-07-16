import { Component, Inject } from '@angular/core';
import { DateTime } from 'luxon';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaLabInstanceService } from '../../../../service-api/ca-lab-instance.service';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { CaLabFreeGetDto, CaLabFreeUpdateDto } from '../../../../model/entities/lab/ca-lab-free.class';

export interface CaLabFreeFormDialogInput {
  freeLabId: string;
  usageLimitInHours: number;
  expirationDate: DateTime;
}

@Component({
  selector: 'ca-lab-free-form-dialog',
  templateUrl: './ca-lab-free-form-dialog.component.html',
  styleUrls: ['./ca-lab-free-form-dialog.component.scss'],
})
export class CaLabFreeFormDialogComponent {

  formGp = new FormBuilder().group({
    usageLimitInHours: [0 as number, Validators.required],
    expirationDate: [null as DateTime]
  });

  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaLabFreeFormDialogInput,
              private labService: CaLabInstanceService,
              private snackBarService: FlSnackBarService,
              private dialogRef: MatDialogRef<CaLabFreeFormDialogComponent>) {
    this.formGp.patchValue({
      expirationDate: this.input.expirationDate,
      usageLimitInHours: this.input.usageLimitInHours
    });
  }

  submit(): void {
    if (this.formGp.value && !this.isLoading) {
      this.updateFreeLab(this.formGp.getRawValue());
    }
  }

  private updateFreeLab(value: CaLabFreeUpdateDto): void {
    this.isLoading = true;
    this.labService.updateFreeLab(this.input.freeLabId, value).subscribe({
      next: freeLab => this.updateFreeLabSuccess(freeLab),
      error: () => this.isLoading = false
    });
  }

  private updateFreeLabSuccess(freeLab: CaLabFreeGetDto): void {
    this.snackBarService.openSuccessMessage({
      text: 'free_data_lab_updated',
      translateText: true
    });
    this.isLoading = false;
    this.dialogRef.close(freeLab);
  }
}
