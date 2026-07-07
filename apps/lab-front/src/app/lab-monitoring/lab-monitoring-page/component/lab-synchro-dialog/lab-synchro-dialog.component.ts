import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { LiSystemService } from '@monorepo/lab-lib/li-core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Dialog to choose open to synchronize lab
 */
@Component({
  selector: 'lab-synchro-dialog',
  templateUrl: './lab-synchro-dialog.component.html',
  styleUrls: ['./lab-synchro-dialog.component.scss'],
  imports: [
    FlDialogModule,
    MatDialogContent,
    ReactiveFormsModule,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    TranslatePipe,
  ],
})
export class LabSynchroDialogComponent {
  private actionService = inject(FlPortalActionsService);
  private systemService = inject(LiSystemService);
  private dialogRef = inject<MatDialogRef<LabSynchroDialogComponent>>(MatDialogRef);

  formGp = new FormBuilder().group({
    syncUsers: true,
    syncFolders: true,
    syncScenarios: true,
    syncNotes: true,
    syncLabConfig: true,
  });

  submit(): void {
    const obs = this.systemService.synchronize({
      sync_users: this.formGp.value.syncUsers,
      sync_folders: this.formGp.value.syncFolders,
      sync_scenarios: this.formGp.value.syncScenarios,
      sync_notes: this.formGp.value.syncNotes,
      sync_lab_config: this.formGp.value.syncLabConfig,
    });

    this.actionService.addAction({
      action: obs,
      type: 'system-synchronize',
      text: { text: 'monitoring.synchronizing_lab', translateText: true },
    });
    this.dialogRef.close();
  }
}
