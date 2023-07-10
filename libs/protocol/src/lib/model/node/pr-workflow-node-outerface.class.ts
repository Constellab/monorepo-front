import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrOuterface} from '../pr-interface.class';
import {PrWorkflowPort} from '../pr-workflow-port.class';
import {computed, Signal} from '@angular/core';


/**
 * Node for the outerfaces
 */
export class PrWorkflowNodeOuterface extends PrWorkflowNode<PrOuterface> {

  // real name of the outerface (the name might have been changed to make it unique)
  public outerfaceName: string;

  constructor(outerfaceNode: PrOuterface, parentLayerId: string, outerfaceName: string) {
    super(outerfaceNode.name, parentLayerId, outerfaceNode);
    this.outerfaceName = outerfaceName;
  }

  getClassName(): string {
    return 'outerface';
  }

  getHTML(): string {
    return `<pr-workflow-node-interface name="${this.nodeName}"></pr-workflow-node-interface>`;
  }


  protected initPorts(object: PrOuterface): void {
    this.createPort(object.portName, {specs: object.portType, resource_id: null}, 'input');
  }

  get title(): Signal<any> {
    return computed(() => this.objectSignal().name)
  }

  getPort(): PrWorkflowPort {
    return this.inputPorts[0];
  }

}
