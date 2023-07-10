import {Component, OnInit, Signal} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {PrWorkflowNodeIo} from '../../model/node/pr-workflow-node-io.class';
import {Observable} from 'rxjs';
import {FlTranslatableText} from '@monorepo/front-core-lib';

@Component({
  selector: 'pr-workflow-node-source',
  templateUrl: './pr-workflow-node-source.component.html',
  styleUrls: ['./pr-workflow-node-source.component.scss']
})
export class PrWorkflowNodeSourceComponent extends PrWorkflowNodeProcessDirective implements OnInit {


  node: PrWorkflowNodeIo;

  title: Signal<Observable<FlTranslatableText>>;


  ngOnInit(): void {
    this.initNode();
    this.title = this.getResourceTitle(this.node.resourceId);
  }


}
