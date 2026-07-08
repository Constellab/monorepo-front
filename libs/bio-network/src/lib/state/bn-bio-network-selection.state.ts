import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { BnBioNetworkGraph } from '../model/bn-bio-network-graph.class';
import { BnBioNetworkNode } from '../model/bn-bio-network-node.class';
import { BnBioNetworkLink } from '../model/bn-bio-network-node-link.class';
import { BnBioNetworkNodeReaction } from '../model/bn-bio-network-node-reaction.class';
import { BnBioNetworkSelectionEvent } from '../model/bn-bio-network-selection.class';
import { BnBioNetworkDrawerState } from './bn-bio-network-drawer.state';

/**
 * Class to manage the selection in the {@link BnBioNetworkComponent}
 * it is independent of rendering
 */
@Injectable()
export class BnBioNetworkSelectionState {
  private drawerState = inject(BnBioNetworkDrawerState);

  private data: BnBioNetworkGraph;

  private selection$: BehaviorSubject<BnBioNetworkSelectionEvent> = new BehaviorSubject({ mode: 'none' });

  // private subscription: Subscription;

  public init(data: BnBioNetworkGraph): void {
    this.data = data;
    this.emitNone();
    this.selectAll();

    // this.subscription?.unsubscribe();
    // this.subscription = this.drawerState.drawerClosed$().subscribe(
    //   () => {
    //     this.selectAll();
    //     this.emitNone();
    //   }
    // );
  }

  /**
   * Select the nodes and direct links and hide all other node and links
   */
  public selectNodeAndDirectLinks(node: BnBioNetworkNode, mode: 'singleNode' | 'singleNodeByClick'): void {
    this.unselectAll();

    const nodeIds = [node.id];

    // when a reaction is selected, we also select the same reaction in the other cluster
    if (node instanceof BnBioNetworkNodeReaction) {
      nodeIds.push(...node.getSameReactionNodesInOtherCluster().map((n) => n.id));
    }

    // TODO fix when the node does not have links
    const links: BnBioNetworkLink[] = this.getConnectedReactionsLinks(nodeIds);

    // select the connected nodes
    const nodes: BnBioNetworkNode[] = this.selectNodesAndLinksFromLinks(links);

    this.selection$.next({ mode: mode, nodes: nodes, links: links, selectedNode: node });

    // open the drawer with detail
    this.drawerState.newAction({
      action: 'nodeDetail',
      selectedNode: node,
    });
  }

  /**
   * Select the nodes and direct links and hide all other node and links
   */
  public selectNodesAndDirectLinks(nodes: BnBioNetworkNode[]): void {
    this.unselectAll();

    if (nodes.length === 0) return;

    const links: BnBioNetworkLink[] = this.getConnectedReactionsLinks(nodes.map((n) => n.id));

    // select the connected nodes
    const connectedNodes: BnBioNetworkNode[] = this.selectNodesAndLinksFromLinks(links);

    this.selection$.next({
      mode: 'multipleNodes',
      nodes: connectedNodes,
      links: links,
      selectedNodes: nodes,
    });
  }

  /**
   * Select the nodes and direct links and hide all other node and links
   */
  public selectNode(node: BnBioNetworkNode, mode: 'singleNode' | 'singleNodeByClick'): void {
    this.unselectAll();

    node.selected = true;

    this.selection$.next({ mode: mode, nodes: [node], links: [], selectedNode: node });

    // open the drawer with detail
    this.drawerState.newAction({
      action: 'nodeDetail',
      selectedNode: node,
    });
  }

  public selectNodes(nodes: BnBioNetworkNode[]): void {
    this.unselectAll();
    if (nodes.length === 0) return;

    for (const node of nodes) {
      node.selected = true;
    }

    this.selection$.next({ mode: 'multipleNodes', nodes: nodes, links: [], selectedNodes: nodes });
  }

  public selectMetaboliteAndReaction(objectId: string): void {
    // retrieve all the nodes that correspond to this metabolite
    const nodes = this.data.getMetaboliteAndReactionNodesByObjectId(objectId);

    if (nodes.length === 0) {
      console.error(`No node found for metabolite ${objectId}`);
    } else if (nodes.length === 1) {
      this.selectNode(nodes[0], 'singleNode');
    } else {
      // select them
      this.selectNodes(nodes);
    }
  }

  // set opacity to 0.1 to link and node where abs value is lower than value
  public fluxThresholdOpacity(value: number): void {
    if (value === 0) {
      this.resetSelection();
      return;
    }

    const links: BnBioNetworkLink[] = [];
    for (const link of this.data.links) {
      if (link.absValue >= value) {
        link.selected = true;
        links.push(link);
      } else {
        link.selected = false;
      }
    }

    // update the node opacity
    const nodes: BnBioNetworkNode[] = [];
    for (const node of this.data.getAllNodes()) {
      if (node.getLinkMaxValue() >= value) {
        node.selected = true;
        nodes.push(node);
      } else {
        node.selected = false;
      }
    }
    this.selection$.next({ mode: 'linkByValue', links: links, nodes: nodes });
  }

  /**
   * Select all the nodes and its link that are of compartments
   * @param compartments
   */
  public selectNodeByCompartments(compartments: string[]): void {
    if (compartments.length === 0) {
      this.resetSelection();
      return;
    }

    this.unselectAll();

    // get all the metabolites indexes in the compartments
    const nodeIds: number[] = this.data
      .getMetaboliteAndCofactors()
      .filter((node) => compartments.includes(node.data.compartment))
      .map((node) => node.id);

    const links: BnBioNetworkLink[] = this.getConnectedLinks(nodeIds);

    // select the connected nodes
    const nodes: BnBioNetworkNode[] = this.selectNodesAndLinksFromLinks(links);

    this.selection$.next({ mode: 'nodesByCompartments', nodes: nodes, links: links });
  }

  // return all the directly connected node of the node
  private getConnectedLinks(nodeIds: number[]): BnBioNetworkLink[] {
    return (
      this.data.links
        // filter the link directly connected
        .filter((link) => nodeIds.includes(link.target.id) || nodeIds.includes(link.source.id))
    );
  }

  // return all the connected links to a node
  // if the connected node is a reaction return also the link connected to the reaction
  private getConnectedReactionsLinks(nodeIds: number[]): BnBioNetworkLink[] {
    const links: BnBioNetworkLink[] = [];

    for (const link of this.data.links) {
      let otherNode: BnBioNetworkNode;
      if (nodeIds.includes(link.target.id)) {
        otherNode = link.source;
      } else if (nodeIds.includes(link.source.id)) {
        otherNode = link.target;
      }

      // if the node is directly connected
      if (otherNode) {
        links.push(link);

        // if the other part of the connection is a reaction, get also all the links of the reaction
        // exclude the link that are crossed cluster
        if (otherNode instanceof BnBioNetworkNodeReaction) {
          links.push(...otherNode.getAllLinks());
        }
      }
    }

    return links;
  }

  // select all the nodes connected to the links and return the node list
  private selectNodesAndLinksFromLinks(links: BnBioNetworkLink[]): BnBioNetworkNode[] {
    const nodes: BnBioNetworkNode[] = [];

    for (const link of links) {
      link.selected = true;
      link.source.selected = true;
      link.target.selected = true;
      nodes.push(link.source, link.target);
    }
    return nodes;
  }

  /**
   * Reset all the color of the nodes and links
   * @param emitSelection if true a none event is triggered in the selection
   */
  public resetSelection(emitSelection: boolean = true): any {
    this.selectAll();

    if (emitSelection) {
      this.emitNone();
    }
  }

  private unselectAll(): void {
    for (const node of this.data.getAllObjects()) {
      node.selected = false;
    }
    for (const link of this.data.links) {
      link.selected = false;
    }
  }

  private selectAll(): void {
    for (const node of this.data.getAllObjects()) {
      node.selected = true;
    }
    for (const link of this.data.links) {
      link.selected = true;
    }
  }

  private emitNone(): void {
    this.selection$.next({ mode: 'none' });
  }

  public clearSelection(): void {
    if (this.selection$.value.mode === 'none') return;
    this.selectAll();
    this.emitNone();
  }

  public getSelectionMode$(): Observable<BnBioNetworkSelectionEvent> {
    return this.selection$.asObservable();
  }
}
