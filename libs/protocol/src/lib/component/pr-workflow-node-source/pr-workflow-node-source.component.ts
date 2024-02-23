import {Component, OnInit} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {PrWorkflowNodeIo} from '../../model/node/pr-workflow-node-io.class';
import {map, Observable} from 'rxjs';
import {FlTranslatableText} from '@monorepo/front-core-lib';
import {PrWorkflowMode} from '../../model/pr-workflow.class';

@Component({
  selector: 'pr-workflow-node-source',
  templateUrl: './pr-workflow-node-source.component.html',
  styleUrls: ['./pr-workflow-node-source.component.scss']
})
export class PrWorkflowNodeSourceComponent extends PrWorkflowNodeProcessDirective implements OnInit {

  resourceId$: Observable<string>;

  node: PrWorkflowNodeIo;

  title$: Observable<FlTranslatableText>;

  isEditMode$: Observable<boolean>;


  ngOnInit(): void {
    this.initNode();
    this.title$ = this.getResourceTitle(this.node.getResourceId$());

    this.resourceId$ = this.node.getResourceId$();
    this.isEditMode$ = this.workflowManager.getMode$().pipe(
      map((mode: PrWorkflowMode) => mode === 'edit')
    );
  }


}
