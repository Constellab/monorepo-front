import { Component, inject } from '@angular/core';
import { FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { LabSystemService } from '../../../../lab-core/service/lab-system.service';
import { MatDialogRef, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
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
  private systemService = inject(LabSystemService);
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
