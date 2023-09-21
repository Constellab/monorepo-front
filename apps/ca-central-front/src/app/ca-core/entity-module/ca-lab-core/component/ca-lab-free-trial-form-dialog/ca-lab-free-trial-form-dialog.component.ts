import {Component, Inject} from '@angular/core';
import {DateTime} from 'luxon';
import {FormBuilder, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CaLabInstanceService} from '../../../../service-api/ca-lab-instance.service';
import {FlSnackBarService} from '@monorepo/front-core-lib';
import {CaFreeTrialUpdateDto, CaLabFreeTrialGetDto} from '../../../../model/entities/lab/ca-lab-free-trial.class';

export interface CaLabFreeTrialFormDialogInput {
  freeTrialId: string;
  usageLimitInHours: number;
  expirationDate: DateTime;
}

@Component({
  selector: 'ca-lab-free-trial-form-dialog',
  templateUrl: './ca-lab-free-trial-form-dialog.component.html',
  styleUrls: ['./ca-lab-free-trial-form-dialog.component.scss'],
})
export class CaLabFreeTrialFormDialogComponent {

  formGp = new FormBuilder().group({
    usageLimitInHours: [0 as number, Validators.required],
    expirationDate: [null as DateTime, Validators.required]
  });

  isLoading: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) private input: CaLabFreeTrialFormDialogInput,
              private labService: CaLabInstanceService,
              private snackBarService: FlSnackBarService,
              private dialogRef: MatDialogRef<CaLabFreeTrialFormDialogComponent>) {
    this.formGp.patchValue({
      expirationDate: this.input.expirationDate,
      usageLimitInHours: this.input.usageLimitInHours
    });
  }

  submit(): void {
    if (this.formGp.value && !this.isLoading) {
      this.updateFreeTrial(this.formGp.getRawValue());
    }
  }

  private updateFreeTrial(value: CaFreeTrialUpdateDto): void {
    this.isLoading = true;
    this.labService.updateFreeTrial(this.input.freeTrialId, value).subscribe({
      next: freeTrial => this.updateFreeTrialSuccess(freeTrial),
      error: () => this.isLoading = false
    });
  }

  private updateFreeTrialSuccess(freeTrial: CaLabFreeTrialGetDto): void {
    this.snackBarService.openSuccessMessage({
      text: 'lab_free_trial_updated',
      translateText: true
    });
    this.isLoading = false;
    this.dialogRef.close(freeTrial);
  }
}
