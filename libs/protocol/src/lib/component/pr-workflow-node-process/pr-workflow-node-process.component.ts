import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { PrWorkflowNodeProtocol } from '../../model/node/pr-workflow-node-protocol.class';
import { FlPortalService, FlStatus, FlTranslatableText } from '@monorepo/front-core-lib';
import { ClHelpService } from '@monorepo/core-lib';
import { PrWorkflowNodeIcon } from '../pr-workflow-node-content/pr-workflow-node-content.component';
import { PrWorkflowNodeDirective } from '../../directive/pr-workflow-node.directive';
import { PrWorkflowNodeProcess } from '../../model/node/pr-workflow-node-process.class';
import { PrWorkflowManagerState } from '../../state/pr-workflow-manager-state';

/**
 * Component to show standard node process in the workflow
 */
@Component({
  selector: 'pr-workflow-node-process',
  templateUrl: './pr-workflow-node-process.component.html',
  styleUrls: ['./pr-workflow-node-process.component.scss'],
})
export class PrWorkflowNodeProcessComponent extends PrWorkflowNodeDirective implements OnInit, OnDestroy {
  node: PrWorkflowNodeProcess;

  layerIsLoading$: Observable<boolean>;

  isProtocol: boolean;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;

  status$: Observable<FlStatus>;

  constructor(
    workflowManager: PrWorkflowManagerState,
    elementRef: ElementRef,
    renderer: Renderer2,
    portalService: FlPortalService
  ) {
    super(workflowManager, elementRef, renderer, portalService);
  }

  ngOnInit(): void {
    this.initNode();
    this.title$ = this.node.getTitle$();
    this.status$ = this.node.getStatus$();

    this.icon$ = this.node.getIcon$();
    this.isProtocol = this.node instanceof PrWorkflowNodeProtocol;

    if (this.isProtocol) {
      this.layerIsLoading$ = (this.node as PrWorkflowNodeProtocol).subLayerIsLoading$();
    }
  }

  zoomInProtocol(mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
    if (this.node instanceof PrWorkflowNodeProtocol) {
      this.workflowManager.selectLayer(this.node.currentObject.id, this.node);
    }
  }
}
