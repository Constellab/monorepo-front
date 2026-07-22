import { Component, inject, ViewContainerRef } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import { LmlManageEnvVarsDialogComponent } from '../lml-manage-env-vars-dialog/lml-manage-env-vars-dialog.component';

/**
 * Env-vars row for the Advanced section. A tile + label + "Manage variables" button
 * that opens the full manage dialog.
 */
@Component({
  selector: 'lml-custom-env-config',
  templateUrl: './lml-custom-env-config.component.html',
  styleUrls: ['./lml-custom-env-config.component.scss'],
  standalone: false,
})
export class LmlCustomEnvConfigComponent {
  private dialogService = inject(FlDialogService);
  private viewContainerRef = inject(ViewContainerRef);

  openEnvVarForm(): void {
    this.dialogService.openMediumDialog(LmlManageEnvVarsDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    });
  }
}
