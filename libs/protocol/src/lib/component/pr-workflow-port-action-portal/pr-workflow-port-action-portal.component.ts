import {Component, Inject} from '@angular/core';
import {FL_PORTAL_DATA, FlMenuDynamic, FlOverlayRef} from '@monorepo/front-core-lib';
import {TdIOSpec} from '@monorepo/technical-doc';
import {PrWorkflowPort} from '../../model/pr-workflow-port.class';

export interface PrWorkflowPortActionPortalInput {
  port: PrWorkflowPort;
  menuDynamics: FlMenuDynamic[];
}

/**
 * Portal opened when clicking on a port to show port info along with button actions for this port
 */
@Component({
  selector: 'pr-workflow-port-action-portal',
  templateUrl: './pr-workflow-port-action-portal.component.html',
  styleUrls: ['./pr-workflow-port-action-portal.component.scss']
})
export class PrWorkflowPortActionPortalComponent {

  ioSpec: TdIOSpec;
  menuDynamics: FlMenuDynamic[];

  constructor(@Inject(FL_PORTAL_DATA) data: PrWorkflowPortActionPortalInput,
              private overlayRef: FlOverlayRef) {
    this.ioSpec = data.port.currentSpecs;
    this.menuDynamics = data.menuDynamics;
  }

  closePortal(): void {
    this.overlayRef.dispose();
  }
}
