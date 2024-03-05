import {PrWorkflowNodeProcess} from './node/pr-workflow-node-process.class';
import {TdTaskViewerConfig} from '@monorepo/technical-doc';
import {PrWorkflowNode} from './node/pr-workflow-node.class';

export type PrWorkflowActionEvent =
  PrWorkflowActionSelectNode
  | PrWorkflowActionOpenSelectResource
  | PrWorkflowActionShowResource
  | PrWorkflowActionShowView
  | PrWorkflowActionShowNextExp
  | PrWorkflowActionNavigateToExp;

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
  action: 'showNextExperiments';
  resourceId: string;
  element: HTMLElement;
}

export interface PrWorkflowActionNavigateToExp {
  action: 'navigateToExperiment';
  experimentId: string;
}
