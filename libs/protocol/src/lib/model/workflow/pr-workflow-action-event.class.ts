import { PrWorkflowNodeProcess } from '../node/pr-workflow-node-process.class';
import { TdTaskViewerConfig } from '@monorepo/technical-doc';
import { PrWorkflowNode } from '../node/pr-workflow-node.class';
import { PrInterface } from '../pr-interface.class';

export type PrWorkflowActionEvent =
  | PrWorkflowActionSelectNode
  | PrWorkflowActionOpenSelectResource
  | PrWorkflowActionShowResource
  | PrWorkflowActionShowView
  | PrWorkflowActionShowNextExp
  | PrWorkflowActionNavigateToExp
  | PrWorkflowActionShowIOFace;

export interface PrWorkflowActionBase {
  action: string;
}

/**
 * Action called when selecting a workflow node
 */
export interface PrWorkflowActionSelectNode extends PrWorkflowActionBase {
  action: 'selectProcessNode';
  processNode: PrWorkflowNodeProcess;
}

/**
 * Action called when selecting a workflow node
 */
export interface PrWorkflowActionOpenSelectResource extends PrWorkflowActionBase {
  action: 'openSelectResource';
  processNode: PrWorkflowNode;
}

/**
 * Action called when selecting a resource
 */
export interface PrWorkflowActionShowResource extends PrWorkflowActionBase {
  action: 'showResource';
  resourceId: string;
}

/**
 * Action called when selecting a resource
 */
export interface PrWorkflowActionShowView extends PrWorkflowActionBase {
  action: 'showView';
  resourceId: string;
  resourceName: string;
  config: TdTaskViewerConfig;
}

export interface PrWorkflowActionShowNextExp {
  action: 'showNextScenarios';
  resourceId: string;
  element: HTMLElement;
}

export interface PrWorkflowActionNavigateToExp {
  action: 'navigateToScenario';
  scenarioId: string;
}

export interface PrWorkflowActionShowIOFace {
  action: 'showIOFace';
  element: HTMLElement;
  type: 'interface' | 'outerface';
  name: string;
  object: PrInterface;
  parentLayerId: string;
}
