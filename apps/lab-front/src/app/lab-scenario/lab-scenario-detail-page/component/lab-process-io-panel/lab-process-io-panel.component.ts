import { AsyncPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, HostBinding, inject, Input, input, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { ClHelpService } from '@monorepo/core-lib';
import { FlCoreComponentModule } from '@monorepo/front-core-lib/fl-core-component';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { LiResourceDetailComponent } from '@monorepo/lab-lib/li-resource';
import { PrWorkflowNodeProcess, PrWorkflowPort, PrWorkflowResourcesState } from '@monorepo/protocol';
import { TranslatePipe } from '@ngx-translate/core';
import { BehaviorSubject, combineLatest, Observable, of, switchMap } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import {
  LabDynamicPortConfigDialogComponent,
  LabDynamicPortConfigDialogInput,
} from '../lab-dynamic-port-config-dialog/lab-dynamic-port-config-dialog.component';

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
  selector: 'lab-process-io-panel',
  templateUrl: './lab-process-io-panel.component.html',
  styleUrls: ['./lab-process-io-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    NgClass,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatTooltip,
    LiResourceDetailComponent,
    FlCoreComponentModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabProcessIoPanelComponent implements OnInit, OnDestroy {
  private nodeState = inject(LabWorkflowNodeDetailState);
  private resourceState = inject(PrWorkflowResourcesState);
  private scenarioState = inject(LabScenarioDetailPageState);
  private dialogService = inject(FlDialogService);

  @Input() nodeProcess$: Observable<PrWorkflowNodeProcess>;

  @Input() mode: 'input' | 'output';

  showAddPortButton = input.required<boolean>();

  @HostBinding('class.is-opened')
  isOpened: boolean = false;

  isDynamicPorts$: Observable<boolean>;
  isEditable$: Observable<boolean> = this.scenarioState.isEditable$();
  ports: Observable<LabWorkflowPortResource>[];

  // observable to retrieve the id of the resource of the selected port
  selectedResourceId$: Observable<string>;

  // store the current selected port, null if none
  private selectedPort$: BehaviorSubject<string | null> = new BehaviorSubject(null);

  ngOnInit(): void {
    this.getPortResources();
    this.getSelectedResource();

    this.isDynamicPorts$ = this.nodeProcess$.pipe(
      switchMap((nodeProcess) => nodeProcess.hasDynamicIOPorts$(this.mode))
    );
  }

  private getPortResources(): void {
    this.nodeProcess$
      .pipe(
        filter((nodeProcess) => nodeProcess != null),
        switchMap((nodeProcess) =>
          this.mode === 'input' ? nodeProcess.getInputPorts$() : nodeProcess.getOutputPorts$()
        )
      )
      .subscribe((ports) => {
        // for each port, get the resource
        const resources: Observable<LabWorkflowPortResource>[] = [];
        for (const port of ports) {
          resources.push(this.portToPortResource(port));
        }
        if (resources.length == 0) {
          this.isOpened = false;
        }
        this.ports = resources;
      });
  }

  private getSelectedResource(): void {
    this.selectedResourceId$ = combineLatest([this.nodeState.getProcess$(), this.selectedPort$]).pipe(
      map(([process, portName]) => {
        if (portName == null) return null;

        const io = this.mode === 'input' ? process.inputs.ports[portName] : process.outputs.ports[portName];

        if (io == null) return null;
        return io.resource_id;
      })
    );
  }

  // get the resource for a given port and return port and resource
  private portToPortResource(port: PrWorkflowPort): Observable<LabWorkflowPortResource> {
    return port.getResourceId$().pipe(
      switchMap((resourceId) => {
        if (resourceId == null) {
          return of({
            port: port,
            text: port.humanName,
          });
        } else {
          return this.resourceState.getResource(resourceId).pipe(
            map((resource) => ({
              port: port,
              text: resource.status === 'success' ? resource.object.name : port.humanName,
            }))
          );
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
    return this.selectedPort$.pipe(map((selectedPort) => selectedPort === portName));
  }

  get addPortTooltip(): string {
    return this.mode === 'input' ? 'biox.add_input_port' : 'biox.add_output_port';
  }

  get removePortTooltip(): string {
    return this.mode === 'input' ? 'biox.remove_input_port' : 'biox.remove_output_port';
  }

  addPort(): void {
    if (this.mode === 'input') {
      this.nodeState.createDynamicInputPort();
    } else {
      this.nodeState.createDynamicOutputPort();
    }
  }

  portMenuClick(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  openEditPortDialog(port: PrWorkflowPort): void {
    const input: LabDynamicPortConfigDialogInput = {
      portType: this.mode,
      portName: port.name,
      spec: port.currentSpecs,
    };

    this.dialogService
      .openSmallDialog(LabDynamicPortConfigDialogComponent, { data: input })
      .afterClosed()
      .subscribe((config) => {
        if (config != null)
          if (input.portType === 'input') {
            this.nodeState.updateDynamicInputPort(input.portName, config);
          } else {
            this.nodeState.updateDynamicOutputPort(input.portName, config);
          }
      });
  }

  removePort(portName: string): void {
    if (this.mode === 'input') {
      this.nodeState.deleteDynamicInputPort(portName);
    } else {
      this.nodeState.deleteDynamicOutputPort(portName);
    }
  }

  get tooltipPosition(): TooltipPosition {
    return this.mode === 'input' ? 'right' : 'left';
  }

  ngOnDestroy(): void {
    this.selectedPort$.complete();
  }
}
