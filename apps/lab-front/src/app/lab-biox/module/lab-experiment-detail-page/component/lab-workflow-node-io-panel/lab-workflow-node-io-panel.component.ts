import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Signal
} from '@angular/core';
import {PrWorkflowPort, PrWorkflowPortType, PrWorkflowResourcesState} from '@monorepo/protocol';
import {BehaviorSubject, combineLatest, Observable, of, switchMap} from 'rxjs';
import {LabResource} from '../../../../../lab-core/model/entities/resource/lab-resource.entity';
import {map} from 'rxjs/operators';
import {LabWorkflowNodeDetailState} from '../../state/lab-workflow-node-detail.state';
import {ClHelpService} from '@monorepo/core-lib';
import {LabExperimentDetailPageState} from '../../state/lab-experiment-detail-page.state';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabWorkflowNodeIoPanelComponent implements OnInit, OnDestroy {


  @Input() portType: PrWorkflowPortType;

  @HostBinding('class.is-opened')
  isOpened: boolean = false;

  isDynamicPorts: Signal<boolean>;

  isEditable$: Observable<boolean> = this.experimentState.isEditable$();
  ports: Signal<Observable<LabWorkflowPortResource>[]>;

  // observable to retrieve the id of the resource of the selected port
  selectedResourceId$: Observable<string>;

  // store the current selected port, null if none
  private selectedPort$: BehaviorSubject<string | null> = new BehaviorSubject(null);


  constructor(private nodeState: LabWorkflowNodeDetailState,
              private resourceState: PrWorkflowResourcesState<LabResource>,
              private experimentState: LabExperimentDetailPageState) {
  }

  ngOnInit(): void {
    this.getPortResources();
    this.getSelectedResource();

    this.isDynamicPorts = computed(() => this.nodeState.node2().hasDynamicIOPorts2(this.portType)());
  }

  private getPortResources(): void {
    this.ports = computed(() => {
      const node = this.nodeState.node2();
      if (node == null) return [];

      const resources: Observable<LabWorkflowPortResource>[] = [];

      // for each port, get the resource
      for (const port of node.portChange(this.portType)()) {
        resources.push(this.portToPortResource(port));
      }

      return resources;
    });
  }

  private getSelectedResource(): void {
    this.selectedResourceId$ = combineLatest([this.nodeState.getProcess$(), this.selectedPort$]).pipe(
      map(([process, portName]) => {
        if (portName == null) return null;

        const io = this.portType === 'input' ? process.inputs.ports[portName] : process.outputs.ports[portName];

        if (io == null) return null;
        return io.resource_id;
      }));
  }

  // get the resource for a given port and return port and resource
  private portToPortResource(port: PrWorkflowPort): Observable<LabWorkflowPortResource> {
    return port.getResourceId$().pipe(
      switchMap(resourceId => {
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
      }));
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
    return this.portType === 'input' ? 'g-layout-row' : 'g-layout-row-reverse';
  }

  portIsSelected(portName: string): Observable<boolean> {
    return this.selectedPort$.pipe(map(selectedPort => selectedPort === portName));
  }

  get addPortTooltip(): string {
    return this.portType === 'input' ? 'biox.add_input_port' : 'biox.add_output_port';
  }

  get removePortTooltip(): string {
    return this.portType === 'input' ? 'biox.remove_input_port' : 'biox.remove_output_port';
  }

  addPort(): void {
    if (this.portType === 'input') {
      this.nodeState.createDynamicInputPort();
    } else {
      this.nodeState.createDynamicOutputPort();
    }
  }

  removePort(portName: string, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);

    if (this.portType === 'input') {
      this.nodeState.deleteDynamicInputPort(portName);
    } else {
      this.nodeState.deleteDynamicOutputPort(portName);
    }
  }

  ngOnDestroy(): void {
    this.selectedPort$.complete();
  }


}
