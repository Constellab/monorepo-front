import { Component } from '@angular/core';
import { FlPortalActionsService } from '@monorepo/front-core-lib';
import { LabSystemService } from '../../../../lab-core/service/lab-system.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

interface LabSynchroForm {
  syncUsers: boolean;
  syncFolders: boolean;
}

/**
 * Dialog to choose open to synchronize lab
 */
@Component({
  selector: 'lab-synchro-dialog',
  templateUrl: './lab-synchro-dialog.component.html',
  styleUrls: ['./lab-synchro-dialog.component.scss'],
})
export class LabSynchroDialogComponent {
  formGp = new FormBuilder().group<LabSynchroForm>({
    syncUsers: true,
    syncFolders: true,
  });

  constructor(
    private actionService: FlPortalActionsService,
    private systemService: LabSystemService,
    private dialogRef: MatDialogRef<LabSynchroDialogComponent>
  ) {}

  submit(): void {
    const obs = this.systemService.synchronize(this.formGp.value.syncUsers, this.formGp.value.syncFolders);

    this.actionService.addAction({
      action: obs,
      type: 'system-synchronize',
      text: { text: 'monitoring.synchronizing_lab', translateText: true },
    });
    this.dialogRef.close();
  }
}
