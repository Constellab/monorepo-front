import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlTranslatableText } from '@monorepo/front-core-lib/fl-translate';
import { Observable } from 'rxjs';

import { PrWorkflowNodeDirective } from '../../directive/pr-workflow-node.directive';
import {
  PrWorkflowNodeResource,
  PrWorkNodeIoExternalButton,
} from '../../model/node/pr-workflow-node-resource.class';
import { PrWorkflowActionState } from '../../state/pr-workflow-action-state';
import { PrWorkflowNodeIcon } from '../pr-workflow-node-content/pr-workflow-node-content.component';

@Component({
  selector: 'pr-workflow-node-resource',
  templateUrl: './pr-workflow-node-resource.component.html',
  styleUrl: './pr-workflow-node-resource.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PrWorkflowNodeResourceComponent extends PrWorkflowNodeDirective implements OnInit {
  protected actionState = inject(PrWorkflowActionState);

  node: PrWorkflowNodeResource;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;

  externalButton$: Observable<PrWorkNodeIoExternalButton | null>;

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
