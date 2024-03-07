import {PrWorkflowNode} from '../node/pr-workflow-node.class';
import {PrWorkflowPort} from './pr-workflow-port.class';
import {PrWorkflowNodeInterface} from '../node/pr-workflow-node-interface.class';
import {PrWorkflowNodeOuterface} from '../node/pr-workflow-node-outerface.class';
import {Subscription} from 'rxjs';

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
    return this.outputNode.instanceName == nodeName || this.inputNode.instanceName == nodeName;
  }

  public colorInputConnection(containerElement: HTMLElement): Subscription {
    return this.inputNode.inputIsProvided$(this.inputPort.name).subscribe(resourceProvided => {
      const element = this.getConnectionElement(containerElement);
      if (element == null) return;

      if (resourceProvided) {
        element.classList.add('g-connection-resource-provided');
      } else {
        element.classList.remove('g-connection-resource-provided');
      }
    });
  }

  public getConnectionElement(containerElement: HTMLElement): HTMLElement {
    const portNodeName = `node_in_node-${this.inputNode.drawflowId}`;
    const portName = this.inputNode.getInputPortDrawflowName(this.inputPort.name);
    return containerElement.querySelector(`.${portNodeName}.${portName}`);
  }
}
