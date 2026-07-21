import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlLoaderModule } from '@monorepo/front-core-lib/fl-loader';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaLab } from '../../../../ca-core/model/entities/lab/ca-lab.class';
import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

export interface CaStopLabDialogInput {
  labId: string;
}

@Component({
  selector: 'ca-lab-stop-dialog',
  templateUrl: './ca-lab-stop-dialog.component.html',
  styleUrl: './ca-lab-stop-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
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
