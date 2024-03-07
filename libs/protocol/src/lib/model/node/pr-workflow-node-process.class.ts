import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrProcess, PrProcessStatus} from '../pr-process.class';
import {map, Observable} from 'rxjs';
import {FlColorHelper, FlStatus, FlThemeService, FlTranslatableText} from '@monorepo/front-core-lib';
import {PrWorkflowResourcesState} from '../../state/pr-workflow-resources.state';
import {PrWorkflowPortType} from '../workflow/pr-workflow-port.class';
import {PrWorkflowNodeIcon} from '../../component/pr-workflow-node-content/pr-workflow-node-content.component';
import {TdTypeStyleIconType} from '@monorepo/technical-doc';
import {PrWorkflowActionState} from '../../state/pr-workflow-action-state';


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
    if (process.processType?.style?.background_color) return process.processType.style.background_color;
    return FlColorHelper.stringToRGBColor(process.processTypingName);
  }

  public getIcon$(): Observable<PrWorkflowNodeIcon> {
    return this.getObject$().pipe(
      map((process: PrProcess) => this.getProcessIcon(process))
    );
  }

  public getProcessIcon(process: PrProcess): PrWorkflowNodeIcon {
    if (process.typeStatus === 'UNAVAILABLE') {
      return {
        icon: 'error',
        iconType: 'MATERIAL_ICON',
        iconColor: FlThemeService.getInstance().getCurrentThemeDetail().accent,
        iconTooltip: 'pr.process_not_available'
      };
    }

    let icon: string = 'protocol';
    let iconType: TdTypeStyleIconType = 'MATERIAL_ICON';
    if (process.processType?.style?.icon_technical_name) {
      icon = process.processType.style.icon_technical_name;
      iconType = process.processType.style.icon_type;
    }

    let iconColor: string;
    if (process?.processType?.style?.icon_color) {
      iconColor = process.processType.style.icon_color;
    } else {
      const nodeColor = this.getNodeColor(process);
      iconColor = FlColorHelper.getContrastColor(nodeColor);
    }
    return {icon: icon, iconColor: iconColor, iconType: iconType};
  }

  onNodeClick(): void {
    this.actionState.newAction({
      action: 'selectProcessNode',
      processNode: this,
    });
  }


}
