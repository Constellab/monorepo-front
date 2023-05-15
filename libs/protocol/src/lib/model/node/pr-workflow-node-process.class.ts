import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrProcess, PrProcessStatus} from '../pr-process.class';
import {PrWorkflowPort} from '../pr-workflow-port.class';
import {PrIO} from '../pr-io.class';
import {PrConfigValues} from '../pr-config.class';
import {map, Observable} from 'rxjs';
import {FlStatus, FlTranslatableText} from '@monorepo/front-core-lib';
import {TdTypingName} from '@monorepo/technical-doc';
import {PrWorkflowResourcesState} from '../../state/pr-workflow-resources.state';

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
    this.inputPorts = this.generatePorts(object.inputs, 'input');
    this.outputPorts = this.generatePorts(object.outputs, 'output');
  }

  // generate ports base on input or output spec
  private generatePorts(specs: Record<string, PrIO>, type: 'input' | 'output'): PrWorkflowPort[] {
    const ports: PrWorkflowPort[] = [];
    let i = 1;
    if (specs) {
      for (const property of Object.keys(specs)) {
        // retrieve the drawflow port name based on index
        let drawFlowName: string;
        if (type === 'input') {
          drawFlowName = PrWorkflowPort.getInputDrawflowName(i);
        } else {
          drawFlowName = PrWorkflowPort.getOutputDrawflowName(i);
        }

        // create the port
        ports.push(new PrWorkflowPort(property, drawFlowName, specs[property].specs));
        i++;
      }
    }


    return ports;
  }

  getStatus$(): Observable<FlStatus<PrProcessStatus> | null> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.status)
    );
  }

  getTitle$(): Observable<FlTranslatableText> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.title ?? process.instanceName)
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

  updateConfigValues(configValues: PrConfigValues): void {
    this.currentObject.config.values = configValues;
    // refresh the current object
    this.updateObject(this.currentObject);
  }

  isSuccess$(): Observable<boolean> {
    return this.getStatus$().pipe(
      map(status => status?.value === 'SUCCESS')
    );
  }

  getInputs$(): Observable<Record<string, PrIO>> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.inputs)
    );
  }

  getOutputs$(): Observable<Record<string, PrIO>> {
    return this.getObject$().pipe(
      map((process: PrProcess) => process.outputs)
    );
  }


}
