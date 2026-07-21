import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { LiResource, LiResourceService, LiShareLink } from '@monorepo/lab-lib/li-core';
import { LiFolderInlineSelectComponent } from '@monorepo/lab-lib/li-folder';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';

export interface LiShareResourceWithSpaceDialogInput {
  resource: LiResource;
}

@Component({
  selector: 'li-share-resource-with-space-dialog',
  templateUrl: './li-share-resource-with-space-dialog.component.html',
  styleUrl: './li-share-resource-with-space-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    LiFolderInlineSelectComponent,
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
export class LiShareResourceWithSpaceDialogComponent {
  private input: LiShareResourceWithSpaceDialogInput = inject(MAT_DIALOG_DATA);

  formGp = new FormBuilder().group({
    folder: [this.input.resource.folder, Validators.required],
    validUntil: [null as DateTime],
  });

  isLoading: boolean = false;

  private resourceService = inject(LiResourceService);
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
      next: (shareLink) => this.shareResourceSuccess(shareLink),
      error: () => (this.isLoading = false),
    });
  }

  private shareResourceSuccess(shareLink: LiShareLink): void {
    this.snackBarService.openSuccessMessage('li.resource_shared_with_space');
    this.dialogRef.close(shareLink);
    this.isLoading = false;
  }
}
