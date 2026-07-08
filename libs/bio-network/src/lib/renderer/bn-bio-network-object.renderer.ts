import { combineLatest, Observable, Subscription } from 'rxjs';

import { BnBioNetworkClusterSelection, BnBioNetworkMetaboliteLevel } from '../model/bn-bio-network.class';
import { BnBioNetworkGraphObject } from '../model/bn-bio-network-graph.class';
import { BnBioNetworkNode } from '../model/bn-bio-network-node.class';
import { BnBioNetworkNodeReaction } from '../model/bn-bio-network-node-reaction.class';
import {
  BnBioNetworkSelectionEvent,
  BnBioNetworkSelectionEventSingleNode,
  BnBioNetworkSelectionMode,
} from '../model/bn-bio-network-selection.class';
import { BnBioNetworkOptions } from '../state/bn-bio-network-options.state';
import { BnBioNetworkGraphRenderer } from './bn-bio-network-main.renderer';

export type BnBioNetworkObjectColorFunction = (node: BnBioNetworkGraphObject) => string;

/**
 * Abstract class for rendering nodes and link of the network
 */
export abstract class BnBioNetworkObjectRenderer {
  private subscription: Subscription;

  protected constructor(
    protected graphRenderer: BnBioNetworkGraphRenderer,
    protected options$: Observable<BnBioNetworkOptions>,
    protected selection$: Observable<BnBioNetworkSelectionEvent>,
    protected greyColor: string
  ) {
    // every time the options or selection changes, update the graph
    this.subscription = combineLatest([options$, selection$]).subscribe(([options, selection]) =>
      this.refreshGraph(options, selection)
    );
  }

  abstract render(): void;

  private refreshGraph(options: BnBioNetworkOptions, selection: BnBioNetworkSelectionEvent): void {
    this.updateObjectColors(options);

    // show the cofactor only on node selection
    const modeToShowCofactor: BnBioNetworkSelectionMode[] = [
      'singleNodeByClick',
      'singleNode',
      'multipleNodes',
    ];
    const showRelatedCofactors = modeToShowCofactor.includes(selection.mode);

    let selectedNodes: BnBioNetworkNode = null;
    if (selection.mode === 'singleNode' || selection.mode === 'singleNodeByClick') {
      selectedNodes = (selection as BnBioNetworkSelectionEventSingleNode).selectedNode;
    }

    // when showing related cofactor, firstly we reset the cofactor position
    // (useful for the live drawing mode)
    if (showRelatedCofactors) {
      for (const node of selection.nodes) {
        if (node instanceof BnBioNetworkNodeReaction) {
          node.setCofactorsPositions();
        }
      }
    }

    this.updateVisibility(options.visibleLevels, selection.mode, selectedNodes, showRelatedCofactors);
  }

  protected abstract updateObjectColors(options: BnBioNetworkOptions): void;

  protected abstract updateVisibility(
    visibleLevels: BnBioNetworkMetaboliteLevel[],
    selectionMode: BnBioNetworkSelectionMode,
    selectedNode: BnBioNetworkNode | null,
    showRelatedCofactor: boolean
  ): void;

  protected getClusterColorFunction(
    clusters: BnBioNetworkClusterSelection[]
  ): BnBioNetworkObjectColorFunction {
    return (node: BnBioNetworkGraphObject) => {
      for (const cluster of clusters) {
        if (node.isInCluster(cluster.id)) {
          return cluster.color;
        }
      }
      return this.greyColor;
    };
  }

  protected getDefaultColorFunction(): BnBioNetworkObjectColorFunction {
    return (node: BnBioNetworkGraphObject) => node.defaultColor;
  }

  protected getLevelVisibilityFunction(
    levels: BnBioNetworkMetaboliteLevel[],
    selectionMode: BnBioNetworkSelectionMode
  ): (object: BnBioNetworkGraphObject) => boolean {
    // when 1 node is selected, show node based on level and selected nodes
    if (selectionMode === 'singleNode' || selectionMode === 'singleNodeByClick') {
      return (object: BnBioNetworkGraphObject): boolean =>
        object.selected || levels.includes(object.getLevel());
      // for other selection, show node based on level
    } else {
      return (object: BnBioNetworkGraphObject): boolean => levels.includes(object.getLevel());
    }
  }

  destroy(): void {
    this.subscription?.unsubscribe();
  }
}
