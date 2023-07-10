import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrInterface} from '../pr-interface.class';
import {PrWorkflowPort} from '../pr-workflow-port.class';
import {computed, Signal} from '@angular/core';

/**
 * Node for the interfaces
 */
export class PrWorkflowNodeInterface extends PrWorkflowNode<PrInterface> {

  // real name of the interface (the name might have been changed to make it unique)
  public interfaceName: string;

  constructor(interfaceNode: PrInterface, parentLayerId: string, interfaceName: string) {
    super(interfaceNode.name, parentLayerId, interfaceNode);
    this.interfaceName = interfaceName;
  }

  getClassName(): string {
    return 'interface';
  }

  getHTML(): string {
    return `<pr-workflow-node-interface name="${this.nodeName}"></pr-workflow-node-interface>`;
  }

  protected initPorts(object: PrInterface): void {
    this.createPort(object.portName, {
      specs: object.portType,
      resource_id: null,
    }, 'output');
  }

  get title(): Signal<any> {
    return computed(() => this.objectSignal().name)
  }

  getPort(): PrWorkflowPort {
    return this.outputPorts[0];
  }


}
