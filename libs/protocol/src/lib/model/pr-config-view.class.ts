import {FlMenuDynamicButton} from '@monorepo/front-core-lib';
import {PrWorkflowPort} from './pr-workflow-port.class';
import {PrWorkflowMode} from './pr-workflow.class';
import {PrWorkflowNode} from './node/pr-workflow-node.class';

export abstract class PrConfigView {


  // Node input & output dynamic menu
  abstract getInputMenu(port: PrWorkflowPort, node: PrWorkflowNode,
                        workflowMode: PrWorkflowMode): FlMenuDynamicButton[];

  abstract getOutputMenu(port: PrWorkflowPort, node: PrWorkflowNode,
                         workflowMode: PrWorkflowMode): FlMenuDynamicButton[];

}

export class PrConfigViewEmpty extends PrConfigView {

  getInputMenu(): FlMenuDynamicButton[] {
    return [];
  }

  getOutputMenu(): FlMenuDynamicButton[] {
    return [];
  }

}
