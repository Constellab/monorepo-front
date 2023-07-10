import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrProcess, PrProcessStatus} from '../pr-process.class';
import {PrPort} from '../pr-io.class';
import {FlStatus} from '@monorepo/front-core-lib';
import {TdTypingName} from '@monorepo/technical-doc';
import {PrWorkflowResourcesState} from '../../state/pr-workflow-resources.state';
import {PrWorkflowPortType} from '../pr-workflow-port.class';
import {computed, Signal} from '@angular/core';

export class PrWorkflowNodeProcess extends PrWorkflowNode<PrProcess> {

  constructor(process: PrProcess, protected resourceState: PrWorkflowResourcesState) {
    super(process.instanceName, process.parentProtocolId, process);
  }

  getClassName(): string {
    return 'node-process';
  }

  getHTML(): string {
    return `<pr-workflow-node name="${this.nodeName}"></pr-workflow-node>`;
  }

  protected initPorts(object: PrProcess): void {
    this.generatePorts(object.inputs.ports, 'input');
    this.generatePorts(object.outputs.ports, 'output');
  }

  // generate ports base on input or output spec
  private generatePorts(specs: Record<string, PrPort>, type: 'input' | 'output'): void {
    if (specs) {
      for (const property of Object.keys(specs)) {
        const port = specs[property];
        this.createPort(property, port, type);
      }
    }
  }

  get status(): Signal<FlStatus<PrProcessStatus> | null> {
    return computed(() => {
      return this.objectSignal().status;
    });
  }

  get title(): Signal<string> {
    return computed(() => {
      const obj = this.objectSignal();
      return obj.title ?? obj.instanceName;
    });
  }

  get subTitle(): Signal<string> {
    return computed(() => {
      const typingName: TdTypingName = new TdTypingName(this.objectSignal().processTypingName);
      return typingName.brickName;
    });
  }


  public hasDynamicIOPorts2(type: PrWorkflowPortType): Signal<boolean> {
    if (type === 'input') {
      return this.hasDynamicInputPorts2();
    } else {
      return this.hasDynamicOutputPorts2();
    }
  }

  public hasDynamicInputPorts2(): Signal<boolean> {
    return computed(() => this.objectSignal().inputs.is_dynamic);
  }

  public hasDynamicOutputPorts2(): Signal<boolean> {
    return computed(() => this.objectSignal().outputs.is_dynamic);
  }
}
