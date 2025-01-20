import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CaLabBackupStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { CaLabManagerRestoreBackupConfigDTO } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';

export interface CaLabRestoreBackupToLabDialogInput {
  labId: string;
  backupStatus: CaLabBackupStatusDTO;
}

@Component({
    selector: 'ca-lab-restore-backup-to-lab',
    templateUrl: './ca-lab-restore-backup-to-lab.component.html',
    styleUrl: './ca-lab-restore-backup-to-lab.component.scss',
    standalone: false
})
export class CaLabRestoreBackupToLabComponent {
  data: CaLabRestoreBackupToLabDialogInput = inject(MAT_DIALOG_DATA);

  formGp = this.formBuilder.group({
    destinationLab: [null as CaLab, Validators.required],
    restoreDb: [true],
    restoreData: [true],
    force: [false],
  });

  isLoading: boolean = false;

  constructor(
    private labService: CaLabService,
    private dialogRef: MatDialogRef<CaLabRestoreBackupToLabComponent>,
    private dialogService: FlDialogService,
    private formBuilder: FormBuilder
  ) {}

  submit(): void {
    if (!this.isLoading && this.formGp.valid) {
      this.restoreBackup();
    }
  }

  private restoreBackup(): void {
    this.isLoading = true;
    const formValue = this.formGp.value;
    const configDTO: CaLabManagerRestoreBackupConfigDTO = {
      restoreDb: formValue.restoreDb,
      restoreData: formValue.restoreData,
      force: formValue.force,
      destinationLabId: formValue.destinationLab.id,
    };

    const input: FlConfirmDialogInput = {
      title: 'restore_backup_to_lab',
      content: 'restore_backup_to_lab_confirmation',
      observable: this.labService.restoreBackup(
        this.data.labId,
        this.data.backupStatus.lastSuccessBackupId,
        configDTO
      ),
      successMessage: 'restore_backup_to_lab_started',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((res) => this.restoreBackupSuccess(res));
  }

  private restoreBackupSuccess(result: FlConfirmDialogResult<CaLab>): void {
    if (result.choice) {
      this.dialogRef.close(result.result);
    }
    this.isLoading = false;
  }
}
