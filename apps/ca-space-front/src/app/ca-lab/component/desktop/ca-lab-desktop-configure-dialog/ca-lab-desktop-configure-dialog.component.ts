import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlFileHelper } from '@monorepo/front-core-lib/fl-translate';
import { TranslatePipe } from '@ngx-translate/core';

import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

export interface CaLabDesktopConfigureDialogInput {
  labId: string;
}

/**
 * Dialog to configure and download the json file for the desktop
 */
@Component({
  selector: 'ca-lab-desktop-configure-dialog',
  templateUrl: './ca-lab-desktop-configure-dialog.component.html',
  styleUrl: './ca-lab-desktop-configure-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    TranslatePipe,
  ],
})
export class CaLabDesktopConfigureDialogComponent {
  formGp = new FormBuilder().nonNullable.group({
    openaiApiKey: [''],
  });
  isLoading: boolean = false;
  private labService = inject(CaLabService);
  private dialogRef = inject(MatDialogRef);
  private input: CaLabDesktopConfigureDialogInput = inject(MAT_DIALOG_DATA);

  submit(): void {
    if (this.isLoading || this.formGp.invalid) return;
    this.downloadConfig();
  }

  private downloadConfig(): void {
    this.isLoading = true;
    this.labService.downloadDesktopLabManagerConfig(this.input.labId, this.formGp.getRawValue()).subscribe({
      next: (blob) => this.downloadConfigSuccess(blob),
      error: () => (this.isLoading = false),
    });
  }

  private downloadConfigSuccess(blob: Blob): void {
    FlFileHelper.downloadBlob(blob, 'lab-manager-config.json');
    this.isLoading = false;
    this.dialogRef.close();
  }
}
