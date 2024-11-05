import { BnBioNetworkNode } from './bn-bio-network-node.class';
import { BnBioNetworkLink } from './bn-bio-network-node-link.class';

/**
 * Different selection modes
 */
export type BnBioNetworkSelectionMode =
  | 'none'
  | 'singleNode'
  | 'singleNodeByClick'
  | 'multipleNodes'
  | 'linkByValue'
  | 'nodesByCompartments';

export type BnBioNetworkSelectionEvent =
  | BnBioNetworkSelectionEventSingleNode
  | BnBioNetworkSelectionEventMultipleNodes
  | BnBioNetworkSelectionEventOther;

export interface BnBioNetworkSelectionEventBase {
  mode: BnBioNetworkSelectionMode;
  nodes?: BnBioNetworkNode[]; // list of selected nodes
  links?: BnBioNetworkLink[]; // list of selected links
}

export interface BnBioNetworkSelectionEventSingleNode extends BnBioNetworkSelectionEventBase {
  mode: 'singleNode' | 'singleNodeByClick'; // to distinguish single node selection by click and by other selection
  selectedNode: BnBioNetworkNode;
}

export interface BnBioNetworkSelectionEventMultipleNodes extends BnBioNetworkSelectionEventBase {
  mode: 'multipleNodes';
  selectedNodes: BnBioNetworkNode[];
}

export interface BnBioNetworkSelectionEventOther extends BnBioNetworkSelectionEventBase {
  mode: 'none' | 'linkByValue' | 'nodesByCompartments' | 'singleNodeByClick';
}
