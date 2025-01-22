import { Component, inject } from '@angular/core';
import { DateTime } from 'luxon';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaLabService } from '../../../../service-api/ca-lab.service';
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
  standalone: false,
})
export class CaLabFreeFormDialogComponent {
  private input = inject<CaLabFreeFormDialogInput>(MAT_DIALOG_DATA);
  private labService = inject(CaLabService);
  private snackBarService = inject(FlSnackBarService);
  private dialogRef = inject<MatDialogRef<CaLabFreeFormDialogComponent>>(MatDialogRef);

  formGp = new FormBuilder().group({
    usageLimitInHours: [0 as number, Validators.required],
    expirationDate: [null as DateTime],
  });

  isLoading: boolean = false;

  constructor() {
    this.formGp.patchValue({
      expirationDate: this.input.expirationDate,
      usageLimitInHours: this.input.usageLimitInHours,
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
      next: (freeLab) => this.updateFreeLabSuccess(freeLab),
      error: () => (this.isLoading = false),
    });
  }

  private updateFreeLabSuccess(freeLab: CaLabFreeGetDto): void {
    this.snackBarService.openSuccessMessage({
      text: 'free_data_lab_updated',
      translateText: true,
    });
    this.isLoading = false;
    this.dialogRef.close(freeLab);
  }
}
