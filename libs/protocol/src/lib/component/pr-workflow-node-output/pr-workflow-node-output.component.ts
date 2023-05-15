import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PrWorkflowNodeIo} from '../../model/node/pr-workflow-node-io.class';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {FlTranslatableText} from '@monorepo/front-core-lib';

@Component({
  selector: 'pr-workflow-node-output',
  templateUrl: './pr-workflow-node-output.component.html',
  styleUrls: ['./pr-workflow-node-output.component.scss']
})
export class PrWorkflowNodeOutputComponent extends PrWorkflowNodeProcessDirective implements OnInit {

  resourceId$: Observable<string>;

  node: PrWorkflowNodeIo;

  title$: Observable<FlTranslatableText>;

  ngOnInit(): void {
    this.initNode();

    this.resourceId$ = this.node.getResourceId$();
    this.title$ = this.getResourceTitle(this.node.getResourceId$());
  }

}
