import {Component, OnDestroy, OnInit} from '@angular/core';
import {PrWorkflowNodeProcessDirective} from '../../directive/pr-workflow-node-process.directive';
import {map, Observable} from 'rxjs';
import {PrWorkflowNodeProtocol} from '../../model/node/pr-workflow-node-protocol.class';
import {FlColorHelper, FlTranslatableText} from '@monorepo/front-core-lib';
import {ClHelpService} from '@monorepo/core-lib';
import {PrWorkflowNodeIcon} from '../pr-workflow-node-content/pr-workflow-node-content.component';
import {PrProcess} from '../../model/pr-process.class';

@Component({
  selector: 'pr-workflow-node',
  templateUrl: './pr-workflow-node.component.html',
  styleUrls: ['./pr-workflow-node.component.scss']
})
export class PrWorkflowNodeComponent extends PrWorkflowNodeProcessDirective implements OnInit, OnDestroy {

  layerIsLoading$: Observable<boolean>;

  isProtocol: boolean;

  title$: Observable<FlTranslatableText>;
  icon$: Observable<PrWorkflowNodeIcon>;


  ngOnInit(): void {
    this.initNode();
    this.title$ = this.node.getTitle$();
    this.icon$ = this.node.getObject$().pipe(
      map((process: PrProcess) => this.getIcon(process))
    );
    this.isProtocol = this.node instanceof PrWorkflowNodeProtocol;

    if (this.isProtocol) {
      this.layerIsLoading$ = (this.node as PrWorkflowNodeProtocol).subLayerIsLoading$();
    }
  }

  private getIcon(process: PrProcess): PrWorkflowNodeIcon {
    if (process.typeStatus === 'UNAVAILABLE') {
      return {
        icon: 'error',
        iconColor: this.themeService.getCurrentThemeDetail().accent,
        iconTooltip: 'pr.process_not_available'
      };
    }

    // todo to remove
    if (process.processTypingName === 'TASK.gws_core.Wait') {
      // return {img: 'https://avatars.githubusercontent.com/u/18176583?v=4'};
      return {img: 'assets/fl-mat-icons/cogs-solid.svg'};
    }

    const nodeColor = this.getNodeColor(process);
    const iconColor = FlColorHelper.getContrastColor(nodeColor);
    return {icon: process.icon ?? 'protocol', iconColor: iconColor};

  }

  openNodeConfiguration(): void {
    this.actionState.newAction({
      action: 'configureNode',
      processNode: this.node,
    });
  }

  zoomInProtocol(mouseEvent: MouseEvent): void {
    ClHelpService.stopEventPropagation(mouseEvent);
    if (this.node instanceof PrWorkflowNodeProtocol) {
      this.workflowManager.selectLayer(this.node.currentObject.id, this.node);
    }
  }


  drawflowNodeClick(): void {
    this.openNodeConfiguration();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

}
