import { PrWorkflowNodeResource, PrWorkNodeIoExternalButton } from './pr-workflow-node-resource.class';
import { PrProcess } from '../pr-process.class';
import { TdTypingName } from '@monorepo/technical-doc';
import { FlThemeService } from '@monorepo/front-core-lib';
import { map, Observable, of } from 'rxjs';

export class PrWorkflowNodeOutput extends PrWorkflowNodeResource<PrProcess> {

  protected initPorts(object: PrProcess): void {
    this.generatePorts(object.inputs.ports, 'input');
    this.generatePorts(object.outputs.ports, 'output');
  }

  protected getDefaultColor(): string {
    return FlThemeService.getInstance().getCurrentThemeDetail().warn;
  }

  getClassName(): string {
    return 'task-output';
  }

  protected getResourceId(process: PrProcess): string | null {
    return process.inputs.ports[TdTypingName.task.output.resourceInput].resource_id ?? null;
  }

  getResourceId$(): Observable<string | null> {
    return this.getObject$().pipe(
      map(process => this.getResourceId(process))
    );
  }

  getCurrentInputResourceId(): string | null {
    return this.getResourceId(this.currentObject);
  }

  getCurrentOutputResourceId(): string | null {
    return null;
  }

  protected getDefaultName(): string {
    return 'Output';
  }

  inputIsProvided$(): Observable<boolean> {
    return this.getResourceId$().pipe(
      map(resource => resource != null)
    );
  }

  outputIsProvided$(): Observable<boolean> {
    return of(false);
  }

  // generate a button on the right to show the next scenarios
  getExternalButtons$(): Observable<PrWorkNodeIoExternalButton | null> {
    if(!this.showExternalButtons) return of(null);
    return this.getResourceId$().pipe(
      map(resourceId => {
        if (!resourceId) return null;

        return {
          position: 'after',
          icon: 'arrow_forward',
          tooltip: 'pr.show_next_objects',
          action: (event: MouseEvent) => {
            this.actionState.newAction({
              action: 'showNextScenarios',
              resourceId: resourceId,
              element: event.target as HTMLElement
            });
          }
        };
      })
    );
  }

  protected getDefaultIcon(): string {
    return 'logout';
  }


}
