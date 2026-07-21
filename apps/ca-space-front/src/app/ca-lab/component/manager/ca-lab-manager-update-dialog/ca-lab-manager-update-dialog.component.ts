import { ChangeDetectionStrategy,Component, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { clVersionValidator } from '@monorepo/core-lib';
import { FlCorePipeModule } from '@monorepo/front-core-lib/fl-core-pipe';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlKeyValueModule } from '@monorepo/front-core-lib/fl-key-value';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LmlLabManagerLibModule, LmlLabManagerMigrationPlanDTO } from '@monorepo/lab-manager-lib';
import { TranslatePipe } from '@ngx-translate/core';
import { of } from 'rxjs';

import { CaLabService } from '../../../../ca-core/service-api/ca-lab.service';

export interface CaLabManagerUpdateDialogInput {
  labId: string;
  migrationPlan: LmlLabManagerMigrationPlanDTO;
}

/**
 * Simple dialog to choose the version of the lab manager to install.
 */
@Component({
  selector: 'ca-lab-manager-update-dialog',
  templateUrl: './ca-lab-manager-update-dialog.component.html',
  styleUrls: ['./ca-lab-manager-update-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    FormsModule,
    FlKeyValueModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatDialogActions,
    MatButton,
    FlCorePipeModule,
    TranslatePipe,
    LmlLabManagerLibModule,
    FlSectionModule,
  ],
})
export class CaLabManagerUpdateDialogComponent {
  private labService = inject(CaLabService);
  private dialogRef = inject<MatDialogRef<CaLabManagerUpdateDialogComponent>>(MatDialogRef);

  input: CaLabManagerUpdateDialogInput = inject(MAT_DIALOG_DATA);

  migrationPlan$ = of(this.input.migrationPlan);

  formCtrl = new FormControl(this.input.migrationPlan.targetVersion, [
    Validators.required,
    clVersionValidator(),
  ]);

  submit(): void {
    if (this.formCtrl.valid) {
      const obs = this.labService.updateLabManager(this.input.labId, this.formCtrl.value);

      this.dialogRef.close(obs);
    }
  }

  reloadMigrationPlan(): void {
    if (this.formCtrl.value && this.formCtrl.valid) {
      this.migrationPlan$ = this.labService.getLabManagerMigrationPlan(this.input.labId, this.formCtrl.value);
    }
  }
}
