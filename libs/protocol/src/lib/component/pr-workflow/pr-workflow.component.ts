import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PrWorkflowManagerState } from '../../state/pr-workflow-manager-state';
import { PrWorkflow, PrWorkflowMode } from '../../model/workflow/pr-workflow.class';
import { Observable, Subscription } from 'rxjs';
import { PrWorkflowNodeMenuConfig } from '../../model/workflow/pr-workflow-node-menu.config';
import {
  PrWorkflowActionEvent,
  PrWorkflowActionShowIOFace,
} from '../../model/workflow/pr-workflow-action-event.class';
import { FlPortalConnectedPosition, FlPortalService } from '@monorepo/front-core-lib';
import {
  PrIoFaceConnectedNodeDatasource,
  PrIofaceInfoPortalComponent,
  PrIofaceInfoPortalData,
} from '../pr-ioface-info-portal/pr-ioface-info-portal.component';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';

@Component({
  selector: 'pr-workflow',
  templateUrl: './pr-workflow.component.html',
  styleUrls: ['./pr-workflow.component.scss'],
})
export class PrWorkflowComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input({ required: true }) workflow: PrWorkflow;

  @Input({ required: true }) viewConfig: PrWorkflowNodeMenuConfig;

  @Input() mode$: Observable<PrWorkflowMode>;

  @ViewChild('workflow', { static: false }) container: ElementRef<HTMLElement>;

  flowIsLoading: boolean = true;
  error: boolean = false;

  private subscription: Subscription;

  constructor(
    private workflowManagerState: PrWorkflowManagerState,
    private portalService: FlPortalService,
    private actionState: PrWorkflowActionState
  ) {}

  ngOnInit(): void {
    if (this.viewConfig == null) {
      console.error('[PrWorkflowComponent] the view config was not provided');
      return;
    }
    if (this.workflow == null) {
      console.error('[PrWorkflowComponent] the workflow was not provided');
      return;
    }

    this.subscription = this.actionState.getAction$().subscribe((action) => this.onNewAction(action));
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.loadScenarioFlow(), 0);
  }

  private loadScenarioFlow(): void {
    this.loadScenarioFlowSuccess();
  }

  private loadScenarioFlowSuccess(): void {
    this.workflowManagerState.init(this.container.nativeElement, this.workflow, this.mode$, this.viewConfig);

    this.flowIsLoading = false;
  }

  private onNewAction(action: PrWorkflowActionEvent): void {
    if (action?.action === 'showIOFace') {
      this.openIoFacePortal(action, action.element);
    }
  }

  private openIoFacePortal(action: PrWorkflowActionShowIOFace, element: HTMLElement): void {
    const position: FlPortalConnectedPosition[] = ['left', 'bottom', 'top', 'right'];
    const data: PrIofaceInfoPortalData = {
      name: action.name,
      object: action.object,
      type: action.type,
      connectedNodesInParent: new PrIoFaceConnectedNodeDatasource(),
    };

    // find the connected node to the interface
    const layer = this.workflow.findLayerById(action.parentLayerId);
    if (layer.parentLayer) {
      if (action.type === 'interface') {
        const connection = layer.parentLayer.findConnectionByRightNode(layer.instanceName, action.name);
        if (connection != null) {
          data.connectedNodesInParent.addItem({
            node: connection.outputNode,
            port: connection.outputPort,
          });
        }
      } else {
        const connections = layer.parentLayer.findConnectionsByLeftNode(layer.instanceName, action.name);
        data.connectedNodesInParent.addItem(
          connections.map((connection) => {
            return {
              node: connection.inputNode,
              port: connection.inputPort,
            };
          })
        );
      }
    }

    const config = this.portalService.configureRelativePortal(element, position, {
      disposeOnOutsideClick: true,
      disposeOnNavigation: true,
    });

    this.portalService.createPortal(PrIofaceInfoPortalComponent, config, data);
  }

  ngOnDestroy(): void {
    this.workflowManagerState.clear();
    this.subscription?.unsubscribe();
  }
}
