import { Component, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlFileHelper } from '@monorepo/front-core-lib';

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
    standalone: false
})
export class CaLabDesktopConfigureDialogComponent {
  formGp = new FormBuilder().group({
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
