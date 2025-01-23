import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DateTime } from 'luxon';
import { LabResourceService } from '../../../../entity-service/lab-resource.service';
import { LabResource } from '../../../../model/entities/resource/lab-resource.entity';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { LabFolderInlineSelectComponent } from '../../../lab-folder-core/component/lab-folder-inline-select/lab-folder-inline-select.component';
import { MatError, MatFormField, MatLabel, MatSuffix, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface LabShareResourceWithSpaceDialogInput {
  resource: LabResource;
}

@Component({
  selector: 'lab-share-resource-with-space-dialog',
  templateUrl: './lab-share-resource-with-space-dialog.component.html',
  styleUrl: './lab-share-resource-with-space-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    LabFolderInlineSelectComponent,
    MatError,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatSuffix,
    MatDatepicker,
    MatHint,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
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
