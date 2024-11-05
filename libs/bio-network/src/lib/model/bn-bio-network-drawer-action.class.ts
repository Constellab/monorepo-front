import { BnBioNetworkNode } from './bn-bio-network-node.class';

// different possible actions for the drawer
export type BnBioNetworkDrawerActionName = 'nodeDetail' | 'config';

/**
 * Value of the state for the drawer
 */
export interface BnBioNetworkDrawerStateValue {
  action: BnBioNetworkDrawerActionName;
  selectedNode: BnBioNetworkNode;
}

// List of possible action for the pathway drawer
export type BnBioNetworkDrawerAction = BnBioNetworkActionNodeDetail | BnBioNetworkActionConfig;

/**
 * Action triggered when selecting a node (metabolites or reaction)
 */
export interface BnBioNetworkActionNodeDetail {
  action: 'nodeDetail';
  selectedNode: BnBioNetworkNode;
}

/**
 * Action to open pathway config
 */
export interface BnBioNetworkActionConfig {
  action: 'config';
}
