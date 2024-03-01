import {Component, OnInit} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {PrWorkflowNodeIo} from '../../model/node/pr-workflow-node-io.class';
import {first, map, Observable} from 'rxjs';
import {FlStatusEvent, FlTranslatableText} from '@monorepo/front-core-lib';
import {PrResource} from '../../model/pr-resource.class';
import {PrWorkflowNodeIcon} from '../pr-workflow-node-content/pr-workflow-node-content.component';
import {ClHelpService} from '@monorepo/core-lib';

@Component({
  selector: 'pr-workflow-node-source',
  templateUrl: './pr-workflow-node-source.component.html',
  styleUrls: ['./pr-workflow-node-source.component.scss']
})
export class PrWorkflowNodeSourceComponent extends PrWorkflowNodeProcessDirective implements OnInit {

  node: PrWorkflowNodeIo;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;

  resourceExpId$: Observable<string>;


  ngOnInit(): void {
    this.initNode();
    this.title$ = this.getResourceTitle(this.node.getResourceId$());
    this.icon$ = this.getResource(this.node.getResourceId$()).pipe(
      map((resource: FlStatusEvent<PrResource>) => this.getResourceIcon(resource))
    );
    this.resourceExpId$ = this.getResource(this.node.getResourceId$()).pipe(
      map((resource: FlStatusEvent<PrResource>) => this.getResourceExpId(resource))
    );
  }

  private getResourceIcon(resource: FlStatusEvent<PrResource>): PrWorkflowNodeIcon {
    const defaultIcon: PrWorkflowNodeIcon = {
      icon: 'logout',
    };
    if (!resource) return defaultIcon;
    if (resource.status === 'success' && resource.object.typeIcon != null) {
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

  private getResourceExpId(resource: FlStatusEvent<PrResource>): string | null {
    if (!resource) return null;
    if(resource.status === 'success' && resource.object.experiment){
      return resource.object.experiment.id;
    }

    return null;
  }

  drawflowNodeClick(): void {
    this.node.getResourceId$().pipe(first()).subscribe(resourceId => {
      if (resourceId) {
        this.openResourceDetail(resourceId);
      } else {
        this.openSelectResource();
      }
    });
  }

  openSelectResource(): void {
    if (this.workflowManager.getCurrentMode() === 'edit') {
      this.actionState.newAction({
        action: 'selectResource',
        processNode: this.node,
      });
    }
  }

  navigateToExperiment(experimentId: string, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.actionState.newAction({
      action: 'navigateToExperiment',
      experimentId: experimentId,
    });
  }


}
