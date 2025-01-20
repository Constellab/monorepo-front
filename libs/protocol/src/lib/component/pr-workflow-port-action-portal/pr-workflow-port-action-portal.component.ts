import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlMenuDynamic, FlOverlayRef } from '@monorepo/front-core-lib';
import { PrWorkflowPort } from '../../model/workflow/pr-workflow-port.class';

export interface PrWorkflowPortActionPortalInput {
  port: PrWorkflowPort;
  menuDynamics: FlMenuDynamic[];
  // provide if the port is an interface or an outerface
  ioface?: {
    name: string;
    type: 'interface' | 'outerface';
  };
}

/**
 * Portal opened when clicking on a port to show port info along with button actions for this port
 */
@Component({
    selector: 'pr-workflow-port-action-portal',
    templateUrl: './pr-workflow-port-action-portal.component.html',
    styleUrls: ['./pr-workflow-port-action-portal.component.scss'],
    standalone: false
})
export class PrWorkflowPortActionPortalComponent {
  data: PrWorkflowPortActionPortalInput = inject(FL_PORTAL_DATA);

  constructor(private overlayRef: FlOverlayRef) {}

  closePortal(): void {
    this.overlayRef.dispose();
  }
}
