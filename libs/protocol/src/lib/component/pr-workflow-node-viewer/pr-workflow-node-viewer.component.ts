import {Component, computed, OnInit, Signal} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {Observable} from 'rxjs';
import {PrWorkflowNodeViewer} from '../../model/node/pr-workflow-node-viewer.class';
import {FlTranslatableText} from '@monorepo/front-core-lib';

@Component({
  selector: 'pr-workflow-node-viewer',
  templateUrl: './pr-workflow-node-viewer.component.html',
  styleUrls: ['./pr-workflow-node-viewer.component.scss']
})
export class PrWorkflowNodeViewerComponent extends PrWorkflowNodeProcessDirective implements OnInit {

  isConfigured: Signal<boolean>;

  node: PrWorkflowNodeViewer;

  title: Signal<Observable<FlTranslatableText>>;

  ngOnInit(): void {
    this.initNode();
    this.isConfigured = computed(
      () => (this.node.configValues())?.view_config != null
    );
    this.title = this.getResourceTitle(this.node.resourceId);
  }

  callView(): void {
    const config = this.node.configValues();
    if (config == null) return;

    const resource = this.node.getCurrentResource();
    if (resource == null) return;

    this.actionState.newAction({
      action: 'showView',
      resourceId: resource.id,
      resourceName: resource.name,
      config: config
    });

  }

}
