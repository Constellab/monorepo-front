import { Component, inject } from '@angular/core';
import { PrInterface } from '../../model/pr-interface.class';
import { FL_PORTAL_DATA, FlArrayObs } from '@monorepo/front-core-lib';
import { PrWorkflowNode } from '../../model/node/pr-workflow-node.class';
import { PrWorkflowPort } from '../../model/workflow/pr-workflow-port.class';

export interface PrIoFaceConnectedNode {
  node: PrWorkflowNode;
  port: PrWorkflowPort;
}

export class PrIoFaceConnectedNodeDatasource extends FlArrayObs<PrIoFaceConnectedNode> {
  protected equals(a: PrIoFaceConnectedNode, b: PrIoFaceConnectedNode): boolean {
    return a.node.drawflowId === b.node.drawflowId && a.port.name === b.port.name;
  }
}

export interface PrIofaceInfoPortalData {
  name: string;
  object: PrInterface;
  type: 'interface' | 'outerface';
  // provided if the ioface is connected to a process node on the parent layer
  connectedNodesInParent: PrIoFaceConnectedNodeDatasource;
}

/**
 * Component to show information about interface or outerface of a protocol
 */
@Component({
    selector: 'pr-ioface-info-portal',
    templateUrl: './pr-ioface-info-portal.component.html',
    styleUrl: './pr-ioface-info-portal.component.scss',
    standalone: false
})
export class PrIofaceInfoPortalComponent {
  data: PrIofaceInfoPortalData = inject(FL_PORTAL_DATA);

  columns = ['node', 'port'];
}
