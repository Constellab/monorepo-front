import { FlStatusEvent } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { map, Observable, of, switchMap } from 'rxjs';

import { PrWorkflowNodeIcon } from '../../component/pr-workflow-node-content/pr-workflow-node-content.component';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';
import { PrWorkflowResourcesState } from '../../state/pr-workflow-resources.state';
import { PrOuterface } from '../pr-interface.class';
import { PrProcess } from '../pr-process.class';
import { PrResource } from '../pr-resource.class';
import { PrWorkflowPort } from '../workflow/pr-workflow-port.class';
import { PrWorkflowNodeProcess } from './pr-workflow-node-process.class';
import { PrWorkflowNodeResource, PrWorkNodeIoExternalButton } from './pr-workflow-node-resource.class';

/**
 * Node for the outerfaces
 */
export class PrWorkflowNodeOuterface extends PrWorkflowNodeResource<PrOuterface> {
  // real name of the outerface (the name might have been changed to make it unique)
  public outerfaceName: string;

  constructor(
    outerfaceObject: PrOuterface,
    parentLayerId: string,
    outerfaceName: string,
    private connectedNode: PrWorkflowNodeProcess,
    private connectedPort: PrWorkflowPort,
    resourceState: PrWorkflowResourcesState,
    actionState: PrWorkflowActionState
  ) {
    super(outerfaceObject.name, parentLayerId, outerfaceObject, true, resourceState, actionState);
    this.outerfaceName = outerfaceName;
  }

  getClassName(): string {
    return 'outerface';
  }

  protected initPorts(object: PrOuterface): void {
    this.createPort(object.portName, { specs: object.portType }, 'input');
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

  getResourceId$(): Observable<string | null> {
    return this.connectedNode
      .getObject$()
      .pipe(map((process) => process.outputs.ports[this.connectedPort.name]?.resource_id ?? null));
  }

  getResource$(): Observable<FlStatusEvent<PrResource> | null> {
    return this.connectedNode.getObject$().pipe(switchMap((node) => this.resourceIsProvided(node)));
  }

  private resourceIsProvided(process: PrProcess): Observable<FlStatusEvent<PrResource> | null> {
    const resourceId = process.outputs.ports[this.connectedPort.name]?.resource_id ?? null;
    if (!resourceId) return of(null);

    return this.resourceState.getResource(resourceId);
  }

  protected getDefaultBackgroundColor(): string {
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
          parentLayerId: this.parentLayerId,
        });
      },
    });
  }

  protected getDefaultIcon(): PrWorkflowNodeIcon {
    return {
      icon: 'logout',
      iconType: 'MATERIAL_ICON',
      iconColor: FlThemeService.getInstance().getCurrentThemeDetail().warnContrast,
    };
  }
}
