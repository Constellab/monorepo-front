import { Component, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';

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
  standalone: false,
})
export class LabConfigureProtocolDialogComponent implements OnInit {
  protocolId: string;

  constructor() {
    const input = inject<LabConfigureProtocolDialogInput>(MAT_DIALOG_DATA);

    this.protocolId = input.protocolId;
  }

  ngOnInit(): void {}
}
