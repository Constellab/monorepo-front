import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {map, Observable} from 'rxjs';
import {PrWorkflowNodeProtocol} from '../../model/node/pr-workflow-node-protocol.class';
import {FlTranslatableText} from '@monorepo/front-core-lib';
import {TdTypeObjectStatus} from '@monorepo/technical-doc';
import {PrProcess} from '../../model/pr-process.class';
import {PrWorkflowMode} from '../../model/pr-workflow.class';

@Component({
  selector: 'pr-workflow-node',
  templateUrl: './pr-workflow-node.component.html',
  styleUrls: ['./pr-workflow-node.component.scss']
})
export class PrWorkflowNodeComponent extends PrWorkflowNodeProcessDirective implements OnInit, OnDestroy {

  layerIsLoading$: Observable<boolean>;


  @HostBinding('class.protocol') isProtocol: boolean;

  title$: Observable<FlTranslatableText>;
  typeStatus$: Observable<TdTypeObjectStatus>;

  showConfigButton$: Observable<boolean> = this.workflowManager.getMode$().pipe(
    map((mode: PrWorkflowMode) => mode === 'edit')
  );


  ngOnInit(): void {
    this.initNode();
    this.title$ = this.node.getTitle$();
    this.typeStatus$ = this.node.getObject$().pipe(
      map((object: PrProcess) => object.typeStatus)
    );
    this.isProtocol = this.node instanceof PrWorkflowNodeProtocol;

    if (this.isProtocol) {
      this.layerIsLoading$ = (this.node as PrWorkflowNodeProtocol).subLayerIsLoading$();
    }
  }

  openNodeConfiguration(): void {
    this.actionState.newAction({
      action: 'configureNode',
      processNode: this.node,
    });
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
