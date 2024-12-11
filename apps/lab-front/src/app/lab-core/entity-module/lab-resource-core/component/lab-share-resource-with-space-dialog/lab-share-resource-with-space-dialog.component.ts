import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DateTime } from 'luxon';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib';

export interface LabShareResourceWithSpaceDialogInput {
  resource: LabResource;
}

@Component({
  selector: 'lab-share-resource-with-space-dialog',
  templateUrl: './lab-share-resource-with-space-dialog.component.html',
  styleUrl: './lab-share-resource-with-space-dialog.component.scss',
})
export class LabShareResourceWithSpaceDialogComponent {
  private input: LabShareResourceWithSpaceDialogInput = inject(MAT_DIALOG_DATA);

  formGp = new FormBuilder().group({
    folder: [this.input.resource.folder, Validators.required],
    validUntil: [null as DateTime],
  });

  isLoading: boolean = false;

  private resourceService = inject(LabResourceService);
  private dialogRef = inject(MatDialogRef);

  private snackBarService = inject(FlSnackBarService);

  submit(): void {
    if (this.isLoading || this.formGp.invalid) {
      return;
    }

    this.shareResourceWithSpace();
  }

  private shareResourceWithSpace(): void {
    this.isLoading = true;
    this.resourceService.shareWithSpace(this.input.resource.id, this.formGp.getRawValue()).subscribe({
      next: () => this.shareResourceSuccess(),
      error: () => (this.isLoading = false),
    });
  }

  private shareResourceSuccess(): void {
    this.snackBarService.openSuccessMessage('biox.resource_shared_with_space');
    this.dialogRef.close();
    this.isLoading = false;
  }
}
