import { PrInterface } from '../pr-interface.class';
import { PrWorkflowPort } from '../workflow/pr-workflow-port.class';
import { map, Observable, of, switchMap } from 'rxjs';
import { FlStatusEvent, FlThemeService } from '@monorepo/front-core-lib';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { PrWorkflowNodeProcess } from './pr-workflow-node-process.class';
import { PrResource } from '../pr-resource.class';
import { PrProcess } from '../pr-process.class';
import { PrWorkflowNodeResource, PrWorkNodeIoExternalButton } from './pr-workflow-node-resource.class';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';

/**
 * Node for the interfaces
 */
export class PrWorkflowNodeInterface extends PrWorkflowNodeResource<PrInterface> {
  // real name of the interface (the name might have been changed to make it unique)
  public interfaceName: string;

  constructor(
    interfaceObject: PrInterface,
    parentLayerId: string,
    interfaceName: string,
    private connectedNode: PrWorkflowNodeProcess,
    private connectedPort: PrWorkflowPort,
    resourceState: PrWorkflowResourcesState,
    actionState: PrWorkflowActionState
  ) {
    super(interfaceObject.name, parentLayerId, interfaceObject, true, resourceState, actionState);
    this.interfaceName = interfaceName;
  }

  getClassName(): string {
    return 'interface';
  }

  protected initPorts(object: PrInterface): void {
    this.createPort(
      object.portName,
      {
        specs: object.portType,
        resource_id: null,
      },
      'output'
    );
  }

  getPort(): PrWorkflowPort {
    return this.outputPorts[0];
  }

  inputIsProvided$(): Observable<boolean> {
    return of(false);
  }

  outputIsProvided$(): Observable<boolean> {
    return this.connectedNode.outputIsProvided$(this.connectedPort.name);
  }

  getCurrentInputResourceId(): string | null {
    return null;
  }

  getCurrentOutputResourceId(): string | null {
    return this.connectedNode.getCurrentOutputResourceId(this.connectedPort.name);
  }

  getResourceId$(): Observable<string> {
    return this.connectedNode
      .getObject$()
      .pipe(map((process) => process.inputs.ports[this.connectedPort.name]?.resource_id ?? null));
  }

  getResource$(): Observable<FlStatusEvent<PrResource>> {
    return this.connectedNode.getObject$().pipe(switchMap((node) => this.getResourceFromProcess(node)));
  }

  private getResourceFromProcess(process: PrProcess): Observable<FlStatusEvent<PrResource>> {
    const resourceId = process.inputs.ports[this.connectedPort.name]?.resource_id ?? null;
    if (!resourceId) return of(null);

    return this.resourceState.getResource(resourceId);
  }

  protected getDefaultColor(): string {
    return FlThemeService.getInstance().getCurrentThemeDetail().primary;
  }

  protected getDefaultName(): string {
    return 'Interface';
  }

  getExternalButtons$(): Observable<PrWorkNodeIoExternalButton | null> {
    if (!this.showExternalButtons) return of(null);

    return of({
      position: 'before',
      icon: 'arrow_backward',
      tooltip: 'pr.show_interface_info',
      action: (event: MouseEvent) => {
        this.actionState.newAction({
          action: 'showIOFace',
          element: event.target as HTMLElement,
          type: 'interface',
          name: this.interfaceName,
          object: this.currentObject,
          parentLayerId: this.parentLayerId,
        });
      },
    });
  }

  protected getDefaultIcon(): string {
    return 'login';
  }
}
