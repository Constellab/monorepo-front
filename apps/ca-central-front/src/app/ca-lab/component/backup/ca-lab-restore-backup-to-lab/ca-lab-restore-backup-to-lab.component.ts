import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { CaLabBackupStatusDTO } from '../../../../ca-core/model/entities/lab/ca-lab-backup.class';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { FlConfirmDialogInput } from '@monorepo/front-core-lib/fl-dialog';
import { FlConfirmDialogResult } from '@monorepo/front-core-lib/fl-dialog';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { CaLabManagerRestoreBackupConfigDTO } from '../../../../ca-core/model/entities/lab/ca-lab-manager.class';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { CaSelectLabComponent } from '../../../../ca-core/entity-module/ca-lab-core/component/ca-select-lab/ca-select-lab.component';
import { MatError } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaLabRestoreBackupToLabDialogInput {
  labId: string;
  backupStatus: CaLabBackupStatusDTO;
}

@Component({
  selector: 'ca-lab-restore-backup-to-lab',
  templateUrl: './ca-lab-restore-backup-to-lab.component.html',
  styleUrl: './ca-lab-restore-backup-to-lab.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    ReactiveFormsModule,
    FlFormModule,
    CaSelectLabComponent,
    MatError,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    FlCorePipeModule,
    TranslatePipe,
  ],
})
export class CaLabRestoreBackupToLabComponent {
  private labService = inject(CaLabService);
  private dialogRef = inject<MatDialogRef<CaLabRestoreBackupToLabComponent>>(MatDialogRef);
  private dialogService = inject(FlDialogService);
  private formBuilder = inject(FormBuilder);

  data: CaLabRestoreBackupToLabDialogInput = inject(MAT_DIALOG_DATA);

  formGp = this.formBuilder.group({
    destinationLab: [null as CaLab, Validators.required],
    restoreDb: [true],
    restoreData: [true],
    force: [false],
  });

  isLoading: boolean = false;

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
