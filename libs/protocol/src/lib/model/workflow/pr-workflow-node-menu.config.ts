import { FlMenuDynamicButton } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { PrWorkflowPort } from './pr-workflow-port.class';
import { PrWorkflowMode } from './pr-workflow.class';
import { PrWorkflowNode } from '../node/pr-workflow-node.class';
import { PrWorkflowLayer } from './pr-workflow-layer.class';

/**
 * Class to override to configure the action menu for a node in the workflow
 */
export abstract class PrWorkflowNodeMenuConfig {
  // Node input & output dynamic menu
  abstract getInputMenu(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    currentLayer: PrWorkflowLayer,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton[];

  abstract getOutputMenu(
    port: PrWorkflowPort,
    node: PrWorkflowNode,
    currentLayer: PrWorkflowLayer,
    workflowMode: PrWorkflowMode
  ): FlMenuDynamicButton[];
}

export class PrWorkflowNodeMenuConfigEmpty extends PrWorkflowNodeMenuConfig {
  getInputMenu(): FlMenuDynamicButton[] {
    return [];
  }

  getOutputMenu(): FlMenuDynamicButton[] {
    return [];
  }
}
