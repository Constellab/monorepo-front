import { PrOuterface } from '../pr-interface.class';
import { PrWorkflowPort } from '../workflow/pr-workflow-port.class';
import { map, Observable, of, switchMap } from 'rxjs';
import { FlStatusEvent, FlThemeService } from '@monorepo/front-core-lib';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { PrResource } from '../pr-resource.class';
import { PrWorkflowNodeProcess } from './pr-workflow-node-process.class';
import { PrProcess } from '../pr-process.class';
import { PrWorkflowNodeResource, PrWorkNodeIoExternalButton } from './pr-workflow-node-resource.class';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';


/**
 * Node for the outerfaces
 */
export class PrWorkflowNodeOuterface extends PrWorkflowNodeResource<PrOuterface> {

  // real name of the outerface (the name might have been changed to make it unique)
  public outerfaceName: string;

  constructor(outerfaceObject: PrOuterface, parentLayerId: string, outerfaceName: string,
              private connectedNode: PrWorkflowNodeProcess, private connectedPort: PrWorkflowPort,
              resourceState: PrWorkflowResourcesState, actionState: PrWorkflowActionState) {
    super(outerfaceObject.name, parentLayerId, outerfaceObject, true, resourceState, actionState);
    this.outerfaceName = outerfaceName;
  }

  getClassName(): string {
    return 'outerface';
  }

  protected initPorts(object: PrOuterface): void {
    this.createPort(object.portName, {specs: object.portType, resource_id: null}, 'input');
  }

  getPort(): PrWorkflowPort {
    return this.inputPorts[0];
  }

  inputIsProvided$(): Observable<boolean> {
    return this.connectedNode.outputIsProvided$(this.connectedPort.name);
  }

  outputIsProvided$(): Observable<boolean> {
    return of(false);
  }

  getCurrentInputResourceId(): string | null {
    return this.connectedNode.getCurrentInputResourceId(this.connectedPort.name);
  }

  getCurrentOutputResourceId(): string | null {
    return null;
  }


  getResourceId$(): Observable<string> {
    return this.connectedNode.getObject$().pipe(
      map(process => process.outputs.ports[this.connectedPort.name]?.resource_id ?? null)
    );
  }


  getResource$(): Observable<FlStatusEvent<PrResource>> {
    return this.connectedNode.getObject$().pipe(
      switchMap(node => this.resourceIsProvided(node))
    );
  }

  private resourceIsProvided(process: PrProcess): Observable<FlStatusEvent<PrResource>> {
    const resourceId = process.outputs.ports[this.connectedPort.name]?.resource_id ?? null;
    if (!resourceId) return of(null);

    return this.resourceState.getResource(resourceId);
  }

  protected getDefaultColor(): string {
    return FlThemeService.getInstance().getCurrentThemeDetail().warn;
  }

  protected getDefaultName(): string {
    return 'Outerface';
  }

  getExternalButtons$(): Observable<PrWorkNodeIoExternalButton | null> {
    if (!this.showExternalButtons) return of(null);

    return of({
      position: 'after',
      icon: 'arrow_forward',
      tooltip: 'pr.show_outerface_info',
      action: (event: MouseEvent) => {
        this.actionState.newAction({
          action: 'showIOFace',
          element: event.target as HTMLElement,
          type: 'outerface',
          name: this.outerfaceName,
          object: this.currentObject,
          parentLayerId: this.parentLayerId
        });
      }
    });
  }

  protected getDefaultIcon(): string {
    return 'logout';
  }

}
