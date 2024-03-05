import {PrWorkflowNodeResource, PrWorkNodeIoExternalButton} from './pr-workflow-node-resource.class';
import {map, Observable, of} from 'rxjs';
import {PrProcess} from '../pr-process.class';
import {TdTypingName} from '@monorepo/technical-doc';
import {FlThemeService} from '@monorepo/front-core-lib';

export class PrWorkflowNodeViewer extends PrWorkflowNodeResource<PrProcess> {

  protected initPorts(object: PrProcess): void {
    this.generatePorts(object.inputs.ports, 'input');
    this.generatePorts(object.outputs.ports, 'output');
  }

  protected getDefaultColor(): string {
    return FlThemeService.getInstance().getCurrentThemeDetail().accent;
  }

  getClassName(): string {
    return 'task-viewer';
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
    return 'Viewer';
  }

  inputIsProvided$(): Observable<boolean> {
    return this.getResourceId$().pipe(
      map(resource => resource != null)
    );
  }

  outputIsProvided$(): Observable<boolean> {
    return of(false);
  }

  getExternalButtons$(): Observable<PrWorkNodeIoExternalButton | null> {
    return undefined;
  }

  protected getDefaultIcon(): string {
    return 'visibility';
  }


}
