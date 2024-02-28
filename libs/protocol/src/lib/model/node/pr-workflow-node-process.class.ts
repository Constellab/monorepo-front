import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrProcess, PrProcessStatus} from '../pr-process.class';
import {PrPort} from '../pr-io.class';
import {PrConfigValues} from '../pr-config.class';
import {map, Observable} from 'rxjs';
import {FlStatus, FlTranslatableText} from '@monorepo/front-core-lib';
import {TdTypingName} from '@monorepo/technical-doc';
import {PrWorkflowResourcesState} from '../../state/pr-workflow-resources.state';
import {PrWorkflowPortType} from '../pr-workflow-port.class';

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

  getStatus$(): Observable<FlStatus<PrProcessStatus> | null> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.status)
    );
  }

  getTitle$(): Observable<FlTranslatableText> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.name ?? process.instanceName)
    );
  }


  getSubTitle$(): Observable<string> {
    return this.getObject$().pipe(
      map((process: PrProcess) => {
        const typingName: TdTypingName = new TdTypingName(process.processTypingName);
        return typingName.brickName;
      })
    );
  }

  getConfigValues$(): Observable<PrConfigValues> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.config.values)
    );
  }

  isSuccess$(): Observable<boolean> {
    return this.getStatus$().pipe(
      map(status => status?.value === 'SUCCESS')
    );
  }

  public hasDynamicIOPorts$(type: PrWorkflowPortType): Observable<boolean> {
    if (type === 'input') {
      return this.hasDynamicInputPorts$();
    } else {
      return this.hasDynamicOutputPorts$();
    }
  }

  public hasDynamicInputPorts$(): Observable<boolean> {
    return this.getObject$().pipe(
      map(process => process.inputs.type === 'dynamic')
    );
  }

  public hasDynamicOutputPorts$(): Observable<boolean> {
    return this.getObject$().pipe(
      map(process => process.outputs.type === 'dynamic')
    );
  }
}
