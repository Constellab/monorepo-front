import {PrWorkflowNode} from './node/pr-workflow-node.class';
import {PrWorkflowPort} from './pr-workflow-port.class';
import {PrWorkflowNodeInterface} from './node/pr-workflow-node-interface.class';
import {PrWorkflowNodeOuterface} from './node/pr-workflow-node-outerface.class';

export class PrWorkflowConnection {

  constructor(public readonly outputNode: PrWorkflowNode,
              public readonly inputNode: PrWorkflowNode,
              public readonly outputPort: PrWorkflowPort,
              public readonly inputPort: PrWorkflowPort) {
  }


  public isInterfaceConnection(): boolean {
    return this.outputNode instanceof PrWorkflowNodeInterface;
  }

  public isOuterfaceConnection(): boolean {
    return this.inputNode instanceof PrWorkflowNodeOuterface;
  }

  public isIOFaceConnection(): boolean {
    return this.isInterfaceConnection() || this.isOuterfaceConnection();
  }

  public isConnectedToNode(nodeName: string): boolean {
    return this.outputNode.nodeName == nodeName || this.inputNode.nodeName == nodeName;
  }
}
