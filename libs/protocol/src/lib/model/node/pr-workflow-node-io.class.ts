import {PrProcess} from '../pr-process.class';
import {PrWorkflowPort} from '../pr-workflow-port.class';
import {PrWorkflowNodeProcess} from './pr-workflow-node-process.class';
import {map, Observable} from 'rxjs';
import {PrResource} from '../pr-resource.class';
import {tdGetTypingNameColor} from '@monorepo/technical-doc';
import {PrWorkflowResourcesState} from '../../state/pr-workflow-resources.state';

export abstract class PrWorkflowNodeIo extends PrWorkflowNodeProcess {

  constructor(process: PrProcess,
              // observable of the resource defined in the config
              resourceState: PrWorkflowResourcesState) {
    super(process, resourceState);
  }

  protected abstract getPort(): PrWorkflowPort;

  public initPortColors(): void {
    this.setPortColor(this.getCurrentResource());
  }


  // set the port color based on selected resource
  private setPortColor(resource: PrResource): void {
    const port = this.getPort();

    const portElement: HTMLElement = port ? this.getPortElement(port) : null;

    if (portElement == null) return;

    // const connectionElement = this.getConnectionElementFromPort(port);
    // if (connectionElement) {
    //   connectionElement.style.stroke = 'red';
    // }
    if (resource) {
      this.setPortElementColor(portElement, tdGetTypingNameColor(resource.resourceTypingName));
    } else {
      this.setPortElementColor(portElement, port.getDefaultColor());
    }
  }

  /////////////////////// RESOURCE ///////////////////////
  protected abstract getResourceId(process: PrProcess): string | null;

  public getResourceId$(): Observable<string> {
    return this.getObject$().pipe(
      map(process => this.getResourceId(process))
    );
  }

  public getCurrentResource(): PrResource | null {
    return this.resourceState.getCurrentResource(this.getResourceId(this.currentObject));
  }

}
