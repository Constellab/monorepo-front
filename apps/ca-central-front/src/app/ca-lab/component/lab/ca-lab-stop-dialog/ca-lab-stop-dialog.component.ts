import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { FlSnackBarService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FlDialogModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-dialog/fl-dialog.module';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FlSectionModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { FlLoaderModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-loader/fl-loader.module';
import { TranslatePipe } from '@ngx-translate/core';

export interface CaStopLabDialogInput {
  labId: string;
}

@Component({
  selector: 'ca-lab-stop-dialog',
  templateUrl: './ca-lab-stop-dialog.component.html',
  styleUrl: './ca-lab-stop-dialog.component.scss',
  imports: [
    FlDialogModule,
    CdkScrollable,
    MatDialogContent,
    FlSectionModule,
    MatCheckbox,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    FlLoaderModule,
    MatDialogClose,
    TranslatePipe,
  ],
})
export class CaLabStopDialogComponent {
  formCtrl = new FormControl(false);

  private input: CaStopLabDialogInput = inject(MAT_DIALOG_DATA);

  labService = inject(CaLabService);

  dialogRef = inject(MatDialogRef);

  snackBarService = inject(FlSnackBarService);

  backupEnabled$: Observable<boolean> = this.labService
    .getBackupsStatus(this.input.labId)
    .pipe(map((backups) => backups.length > 0));
  isLoading = false;

  submit(): void {
    if (!this.isLoading) {
      this.isLoading = true;
      this.labService
        .stopLab(this.input.labId, {
          backupLabBefore: this.formCtrl.value,
        })
        .subscribe({
          next: (lab) => this.stopLabSuccess(lab, this.formCtrl.value),
          error: () => (this.isLoading = false),
        });
    }
  }

  private stopLabSuccess(lab: CaLab, backupBeforeStop: boolean): void {
    if (backupBeforeStop) {
      this.snackBarService.openSuccessMessage('lab_backup_before_stop');
    } else {
      this.snackBarService.openSuccessMessage('lab_is_stopping');
    }
    this.isLoading = false;
    this.dialogRef.close(lab);
  }
}
