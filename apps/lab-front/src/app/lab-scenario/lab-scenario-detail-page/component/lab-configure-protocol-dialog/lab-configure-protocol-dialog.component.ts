import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent } from '@angular/material/dialog';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { FlDialogModule } from '@monorepo/front-core-lib/fl-dialog';
import { LabConfigureProtocolComponent } from '../lab-configure-protocol/lab-configure-protocol.component';
import { TranslatePipe } from '@ngx-translate/core';

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
  providers: [LabProcessDashboardConfigState],
  imports: [FlDialogModule, MatDialogContent, LabConfigureProtocolComponent, TranslatePipe],
})
export class LabConfigureProtocolDialogComponent implements OnInit {
  protocolId: string;

  constructor() {
    const input = inject<LabConfigureProtocolDialogInput>(MAT_DIALOG_DATA);

    this.protocolId = input.protocolId;
  }

  ngOnInit(): void {}
}
