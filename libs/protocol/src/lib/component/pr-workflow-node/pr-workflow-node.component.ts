import {Component, OnDestroy, OnInit} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {Observable} from 'rxjs';
import {PrWorkflowNodeProtocol} from '../../model/node/pr-workflow-node-protocol.class';
import {FlTranslatableText} from '@monorepo/front-core-lib';

@Component({
  selector: 'pr-workflow-node',
  templateUrl: './pr-workflow-node.component.html',
  styleUrls: ['./pr-workflow-node.component.scss']
})
export class PrWorkflowNodeComponent extends PrWorkflowNodeProcessDirective implements OnInit, OnDestroy {

  layerIsLoading$: Observable<boolean>;
  isProtocol: boolean;

  title$: Observable<FlTranslatableText>;


  ngOnInit(): void {
    this.initNode();
    this.title$ = this.node.getTitle$();
    this.isProtocol = this.node instanceof PrWorkflowNodeProtocol;

    if (this.isProtocol) {
      this.layerIsLoading$ = (this.node as PrWorkflowNodeProtocol).subLayerIsLoading$();
    }
  }

  zoomInProtocol(): void {
    if (this.node instanceof PrWorkflowNodeProtocol) {
      this.workflowManager.selectLayer(this.node.currentObject.id, this.node);
    }
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
