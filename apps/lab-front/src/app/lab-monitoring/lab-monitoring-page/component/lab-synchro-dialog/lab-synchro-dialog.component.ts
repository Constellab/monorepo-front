import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject } from '@angular/core';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { LiSystemService } from '@monorepo/lab-lib/li-core';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

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
  imports: [
    FlDialogModule,
    CdkScrollable,
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

  formGp = new FormBuilder().group<LabSynchroForm>({
    syncUsers: true,
    syncFolders: true,
  });

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
