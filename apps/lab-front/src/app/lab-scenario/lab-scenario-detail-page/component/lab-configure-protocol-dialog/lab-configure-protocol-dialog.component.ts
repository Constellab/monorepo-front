import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { LabConfigureProtocolComponent } from '../lab-configure-protocol/lab-configure-protocol.component';

export interface LabConfigureProtocolDialogInput {
  protocolId: string;
}

/**
 * Dialog to configure a protocol
 */
@Component({
  selector: 'lab-configure-protocol-dialog',
  templateUrl: './lab-configure-protocol-dialog.component.html',
  styleUrls: ['./lab-configure-protocol-dialog.component.scss'],
  imports: [FlDialogModule, MatDialogContent, LabConfigureProtocolComponent, TranslatePipe],
})
export class LabConfigureProtocolDialogComponent {
  protocolId: string;

  constructor() {
    const input = inject<LabConfigureProtocolDialogInput>(MAT_DIALOG_DATA);

    this.protocolId = input.protocolId;
  }
}
