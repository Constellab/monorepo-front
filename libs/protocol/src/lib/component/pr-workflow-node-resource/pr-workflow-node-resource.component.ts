import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { PrWorkflowNodeDirective } from '../../directive/pr-workflow-node.directive';
import { Observable } from 'rxjs';
import { FlPortalService, FlTranslatableText } from '@monorepo/front-core-lib';
import { PrWorkflowNodeIcon } from '../pr-workflow-node-content/pr-workflow-node-content.component';
import { PrWorkflowManagerState } from '../../state/pr-workflow-manager-state';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';
import {
  PrWorkflowNodeResource,
  PrWorkNodeIoExternalButton,
} from '../../model/node/pr-workflow-node-resource.class';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
    selector: 'pr-workflow-node-resource',
    templateUrl: './pr-workflow-node-resource.component.html',
    styleUrl: './pr-workflow-node-resource.component.scss',
    standalone: false
})
export class PrWorkflowNodeResourceComponent extends PrWorkflowNodeDirective implements OnInit {
  node: PrWorkflowNodeResource;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;

  externalButton$: Observable<PrWorkNodeIoExternalButton | null>;

  constructor(
    workflowManager: PrWorkflowManagerState,
    elementRef: ElementRef,
    renderer: Renderer2,
    portalService: FlPortalService,
    protected actionState: PrWorkflowActionState
  ) {
    super(workflowManager, elementRef, renderer, portalService);
  }

  ngOnInit(): void {
    this.initNode();

    this.title$ = this.node.getTitle$();
    this.icon$ = this.node.getIcon$();
    this.externalButton$ = this.node.getExternalButtons$();
  }

  callExternalButton(button: PrWorkNodeIoExternalButton, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    button.action(event);
  }
}
