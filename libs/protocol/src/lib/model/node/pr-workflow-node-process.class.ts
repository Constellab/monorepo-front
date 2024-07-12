import { PrWorkflowNode } from './pr-workflow-node.class';
import { PrProcess, PrProcessStatus } from '../pr-process.class';
import { map, Observable } from 'rxjs';
import { FlStatus, FlTranslatableText } from '@monorepo/front-core-lib';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { PrWorkflowPortType } from '../workflow/pr-workflow-port.class';
import { PrWorkflowNodeIcon } from '../../component/pr-workflow-node-content/pr-workflow-node-content.component';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';


export class PrWorkflowNodeProcess extends PrWorkflowNode<PrProcess> {

  constructor(process: PrProcess, protected resourceState: PrWorkflowResourcesState,
              private actionState: PrWorkflowActionState) {
    super(process.instanceName, process.parentProtocolId, process);
  }

  getClassName(): string {
    return 'node-process';
  }

  getHTML(): string {
    return `<pr-workflow-node-process name="${this.instanceName}"></pr-workflow-node-process>`;
  }

  protected initPorts(object: PrProcess): void {
    this.generatePorts(object.inputs.ports, 'input');
    this.generatePorts(object.outputs.ports, 'output');
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

  public inputIsProvided$(portName: string): Observable<boolean> {
    return this.getObject$().pipe(
      map(process => {
        const port = process.inputs?.ports[portName];
        return port && port.resource_id != null;
      })
    );
  }

  public outputIsProvided$(portName: string): Observable<boolean> {
    return this.getObject$().pipe(
      map(process => {
        const port = process.outputs?.ports[portName];
        return port && port.resource_id != null;
      })
    );
  }

  getCurrentInputResourceId(portName: string): string | null {
    const process = this.currentObject;
    return process.inputs?.ports[portName]?.resource_id ?? null;
  }

  getCurrentOutputResourceId(portName: string): string | null {
    const process = this.currentObject;
    return process.outputs?.ports[portName]?.resource_id ?? null;
  }

  getNodeColor$(): Observable<string> {
    return this.getObject$().pipe(
      map(process => this.getNodeColor(process))
    );
  }

  public getNodeColor(process: PrProcess): string {
    return process.style.background_color;
  }

  public getIcon$(): Observable<PrWorkflowNodeIcon> {
    return this.getObject$().pipe(
      map((process: PrProcess) => this.getProcessIcon(process))
    );
  }

  public getProcessIcon(process: PrProcess): PrWorkflowNodeIcon {
    // if (process.typeStatus === 'UNAVAILABLE') {
    //   return {
    //     icon: 'error',
    //     iconType: 'MATERIAL_ICON',
    //     iconColor: process.style.icon_color,
    //     iconTooltip: 'pr.process_not_available'
    //   };
    // }

    return {
      icon: process.style.icon_technical_name,
      iconColor: process.style.icon_color,
      iconType: process.style.icon_type
    };
  }

  onNodeClick(): void {
    this.actionState.newAction({
      action: 'selectProcessNode',
      processNode: this,
    });
  }


}
