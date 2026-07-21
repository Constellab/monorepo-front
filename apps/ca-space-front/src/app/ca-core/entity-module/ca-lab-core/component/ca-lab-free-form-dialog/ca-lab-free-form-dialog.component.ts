import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

import { CaLabFreeGetDto, CaLabFreeUpdateDto } from '../../../../model/entities/lab/ca-lab-free.class';
import { CaLabService } from '../../../../service-api/ca-lab.service';

export interface CaLabFreeFormDialogInput {
  freeLabId: string;
  usageLimitInHours: number;
  expirationDate: DateTime;
}

@Component({
  selector: 'ca-lab-free-form-dialog',
  templateUrl: './ca-lab-free-form-dialog.component.html',
  styleUrls: ['./ca-lab-free-form-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
