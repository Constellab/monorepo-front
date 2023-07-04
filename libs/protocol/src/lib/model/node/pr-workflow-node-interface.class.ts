import {PrWorkflowNode} from './pr-workflow-node.class';
import {PrInterface} from '../pr-interface.class';
import {PrWorkflowPort} from '../pr-workflow-port.class';
import {map, Observable, of} from 'rxjs';
import {FlStatus} from '@monorepo/front-core-lib';

/**
 * Node for the interfaces
 */
export class PrWorkflowNodeInterface extends PrWorkflowNode<PrInterface> {

  // real name of the interface (the name might have been changed to make it unique)
  public interfaceName: string;

  constructor(interfaceNode: PrInterface, parentLayerId: string, interfaceName: string) {
    super(interfaceNode.name, parentLayerId, interfaceNode);
    this.interfaceName = interfaceName;
  }

  getClassName(): string {
    return 'interface';
  }

  getHTML(): string {
    return `<pr-workflow-node-interface name="${this.nodeName}"></pr-workflow-node-interface>`;
  }

  protected initPorts(object: PrInterface): void {
    // TODO check null
    this.createPort(object.portName, {
      specs: object.portType,
      resource_id: null,
    }, 'output');
  }

  getStatus$(): Observable<FlStatus | null> {
    return of(null);
  }

  getTitle$(): Observable<string> {
    return this.getObject$().pipe(
      map(object => object.name)
    );
  }

  getSubTitle$(): Observable<string> {
    return of(null);
  }

  getPort(): PrWorkflowPort {
    return this.outputPorts[0];
  }


}
