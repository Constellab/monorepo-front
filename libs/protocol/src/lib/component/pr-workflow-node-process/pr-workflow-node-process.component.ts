import { Component, ElementRef, inject,OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlStatus } from '@monorepo/front-core-lib/fl-status';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { PrWorkflowNodeDirective } from '../../directive/pr-workflow-node.directive';
import { PrWorkflowNodeProcess } from '../../model/node/pr-workflow-node-process.class';
import { PrWorkflowNodeProtocol } from '../../model/node/pr-workflow-node-protocol.class';
import { PrWorkflowManagerState } from '../../state/pr-workflow-manager-state';
import { PrWorkflowNodeIcon } from '../pr-workflow-node-content/pr-workflow-node-content.component';

/**
 * Component to show standard node process in the workflow
 */
@Component({
  selector: 'pr-workflow-node-process',
  templateUrl: './pr-workflow-node-process.component.html',
  styleUrls: ['./pr-workflow-node-process.component.scss'],
  standalone: false,
})
export class PrWorkflowNodeProcessComponent extends PrWorkflowNodeDirective implements OnInit, OnDestroy {
  node: PrWorkflowNodeProcess;

  layerIsLoading$: Observable<boolean>;

  isProtocol: boolean;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;

  status$: Observable<FlStatus>;

  constructor() {
    const workflowManager = inject(PrWorkflowManagerState);
    const elementRef = inject(ElementRef);
    const renderer = inject(Renderer2);
    const portalService = inject(FlPortalService);

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
