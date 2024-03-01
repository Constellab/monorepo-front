import {Component, OnInit} from '@angular/core';
import {first, map, Observable} from 'rxjs';
import {PrWorkflowNodeIo} from '../../model/node/pr-workflow-node-io.class';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {FlStatusEvent, FlTranslatableText} from '@monorepo/front-core-lib';
import {PrResource} from '../../model/pr-resource.class';
import {PrWorkflowNodeIcon} from '../pr-workflow-node-content/pr-workflow-node-content.component';
import {ClHelpService} from '@monorepo/core-lib';

@Component({
  selector: 'pr-workflow-node-output',
  templateUrl: './pr-workflow-node-output.component.html',
  styleUrls: ['./pr-workflow-node-output.component.scss']
})
export class PrWorkflowNodeOutputComponent extends PrWorkflowNodeProcessDirective implements OnInit {

  node: PrWorkflowNodeIo;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;

  resourceId$: Observable<string>;


  ngOnInit(): void {
    this.initNode();

    this.title$ = this.getResourceTitle(this.node.getResourceId$());
    this.icon$ = this.getResource(this.node.getResourceId$()).pipe(
      map((resource: FlStatusEvent<PrResource>) => this.getResourceIcon(resource))
    );

    this.resourceId$ = this.node.getResourceId$();
  }

  private getResourceIcon(resource: FlStatusEvent<PrResource>): PrWorkflowNodeIcon {
    const defaultIcon: PrWorkflowNodeIcon = {
      icon: 'login',
    };
    if (!resource) return defaultIcon;

    if (resource && resource.status === 'success' && resource.object.typeIcon != null) {
      return {icon: resource.object.typeIcon};
    }

    if (resource.status === 'error') {
      return {
        icon: 'error',
        iconTooltip: 'pr.resource_load_error'
      };
    }

    return defaultIcon;
  }

  drawflowNodeClick(): void {
    this.node.getResourceId$().pipe(first()).subscribe(resourceId => {
      if (resourceId) {
        this.openResourceDetail(resourceId);
      }
    });
  }

  openNextExperimentDialog(resourceId: string, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);

    this.actionState.newAction({
      action: 'showNextExperiments',
      resourceId: resourceId,
      element: event.target as HTMLElement
    });
  }
}
