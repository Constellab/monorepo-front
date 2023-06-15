import {Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {PrWorkflowNodeProcess, PrWorkflowPort, PrWorkflowResourcesState} from '@monorepo/protocol';
import {BehaviorSubject, combineLatest, Observable, of, switchMap} from 'rxjs';
import {LabResource} from '../../../../../lab-core/model/entities/resource/lab-resource.entity';
import {map} from 'rxjs/operators';
import {LabWorkflowNodeDetailState} from '../../state/lab-workflow-node-detail.state';

/**
 * Object that include port and resource
 */
interface LabWorkflowPortResource {
  port: PrWorkflowPort;
  text: string;
}


/**
 * Component inside the node dashboard to display the input or output resources
 */
@Component({
  selector: 'lab-workflow-node-io-panel',
  templateUrl: './lab-workflow-node-io-panel.component.html',
  styleUrls: ['./lab-workflow-node-io-panel.component.scss'],
})
export class LabWorkflowNodeIoPanelComponent implements OnInit, OnDestroy {

  @Input() nodeProcess$: Observable<PrWorkflowNodeProcess>;

  @Input() mode: 'input' | 'output';

  @HostBinding('class.is-opened')
  isOpened: boolean = false;

  ports: Observable<LabWorkflowPortResource>[];

  // observable to retrieve the id of the resource of the selected port
  selectedResourceId$: Observable<string>;

  // store the current selected port, null if none
  private selectedPort$: BehaviorSubject<string | null> = new BehaviorSubject(null);


  constructor(private nodeState: LabWorkflowNodeDetailState,
              private resourceState: PrWorkflowResourcesState<LabResource>) {
  }

  ngOnInit(): void {
    this.getPortResources();
    this.getSelectedResource();
  }

  private getPortResources(): void {
    this.nodeProcess$.subscribe(nodeProcess => {

      const ports = this.mode === 'input' ? nodeProcess.inputPorts : nodeProcess.outputPorts;

      // for each port, get the resource
      const resources: Observable<LabWorkflowPortResource>[] = [];
      for (const port of ports) {
        resources.push(this.portToPortResource(port.name, nodeProcess));
      }

      this.ports = resources;
    });
  }

  private getSelectedResource(): void {
    this.selectedResourceId$ = combineLatest([this.nodeState.getProcess$(), this.selectedPort$]).pipe(
      map(([process, portName]) => {
        if (portName == null) return null;

        const io = this.mode === 'input' ? process.inputs[portName] : process.outputs[portName];

        if (io == null) return null;
        return io.resource_id;
      }));
  }

  // get the resource for a given port and return port and resource
  private portToPortResource(portName: string, nodeProcess: PrWorkflowNodeProcess): Observable<LabWorkflowPortResource> {
    const port = this.mode === 'input' ? nodeProcess.findInputPortByName(portName) :
      nodeProcess.findOutputPortByName(portName);

    return nodeProcess.getObject$().pipe(
      switchMap(process => {
        const resourceId: string | null = this.mode === 'input' ?
          process.inputs[portName]?.resource_id : process.outputs[portName]?.resource_id;

        if (resourceId == null) {
          return of({
            port: port,
            text: port.humanName
          });
        } else {
          return this.resourceState.getResource(resourceId).pipe(
            map(resource => ({
              port: port,
              text: resource.status === 'success' ? resource.object.name : port.humanName
            })));
        }
      })
    );
  }

  onPortClick(portName: string): void {
    // close the resource if it is already open
    if (portName === this.selectedPort$.value) {
      this.selectedPort$.next(null);
      this.isOpened = false;
    } else {
      this.selectedPort$.next(portName);
      this.isOpened = true;
    }
  }

  // useful to set the resource on the left or right side of the node
  get layoutClass(): string {
    return this.mode === 'input' ? 'g-layout-row' : 'g-layout-row-reverse';
  }

  portIsSelected(portName: string): Observable<boolean> {
    return this.selectedPort$.pipe(map(selectedPort => selectedPort === portName));
  }

  ngOnDestroy(): void {
    this.selectedPort$.complete();
  }


}
