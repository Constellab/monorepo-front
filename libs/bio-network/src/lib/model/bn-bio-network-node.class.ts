import { SimulationNodeDatum } from 'd3';
import {
  BnBioNetworkMetabolite,
  BnBioNetworkMetaboliteLevel,
  BnBioNetworkReaction,
} from './bn-bio-network.class';
import { BnBioNetworkLink } from './bn-bio-network-node-link.class';
import { BnBioNetworkGraphObject } from './bn-bio-network-graph.class';
import { FlCoord } from '@monorepo/front-core-lib/fl-core';

export type BnBioNetworkNodeType = 'metabolite' | 'reaction' | 'cofactor';

export abstract class BnBioNetworkNode extends BnBioNetworkGraphObject implements SimulationNodeDatum {
  private static globalId: number = 0;

  public readonly id: number;

  // the following properties are set by d3
  // Node’s zero-based index into nodes array. This property is set during the initialization process of a simulation.
  index?: number;
  // Node’s current x-position
  x?: number;
  //Node’s current y-position
  y?: number;
  // Node’s current x-velocity
  vx?: number;
  // Node’s current y-velocity
  vy?: number;

  fx?: number;
  fy?: number;

  public departureLinks: BnBioNetworkLink[] = [];
  public arrivalLinks: BnBioNetworkLink[] = [];

  // list of nodes that are linked to this node
  // It means that when this node moves, all the linked nodes move
  public childNodes: BnBioNetworkNode[] = [];
  public parentNode: BnBioNetworkNode;

  public isVisible: boolean = true;

  protected constructor(
    public name: string,
    public type: BnBioNetworkNodeType,
    public defaultColor: string,
    public strokeColor: string,
    public data: BnBioNetworkMetabolite | BnBioNetworkReaction
  ) {
    super();
    this.id = BnBioNetworkNode.globalId++;
  }

  protected abstract _getLevel(): BnBioNetworkMetaboliteLevel;

  ///////////////////////////////////////////// POSITIONS ////////////////////////////////

  public getCoords(): FlCoord {
    return {
      x: this.x,
      y: this.y,
    };
  }

  /**
   * Set the position of the node
   * return the ids of the moved nodes
   */
  public setPosition(coord: FlCoord): void {
    this.x = coord.x;
    this.y = coord.y;

    this.savePosition();
  }

  public setPositionAndFreeze(coord: FlCoord): void {
    this.setPosition(coord);
    this.freezePosition();
  }

  public hasPositions(): boolean {
    return this.x != null && this.y != null;
  }

  public savePosition(): void {}

  public initPosition(): void {
    if (this.x == null && this.y == null) {
      this.setPosition({ x: 0, y: 0 });
    }
  }

  // set the fixed positions = positions
  public freezePosition(): void {
    this.fx = this.x;
    this.fy = this.y;
  }

  ///////////////////////////////////////////// NODES ////////////////////////////////////////////
  public addChildNode(node: BnBioNetworkNode): void {
    this.childNodes.push(node);
    node.parentNode = this;
  }

  public getNextNodes(): BnBioNetworkNode[] {
    return this.departureLinks.map((link) => link.target);
  }

  public getPreviousNodes(): BnBioNetworkNode[] {
    return this.arrivalLinks.map((link) => link.source);
  }

  public getConnectedNodes(): BnBioNetworkNode[] {
    return [...this.getPreviousNodes(), ...this.getNextNodes()];
  }

  public getAllLinks(): BnBioNetworkLink[] {
    return [...this.departureLinks, ...this.arrivalLinks];
  }

  /**
   * Search the link, link to the node and the provided node
   * @param nodeId
   */
  public getLinkToNode(nodeId: number): BnBioNetworkLink | null {
    // search on departure links
    let link = this.departureLinks.find((link) => link.target.id === nodeId);
    if (link) return link;

    // search on arrival links
    link = this.arrivalLinks.find((link) => link.source.id === nodeId);
    return link;
  }

  public getLinkMaxValue(): number {
    return Math.max(...[...this.departureLinks, ...this.arrivalLinks].map((link) => link.absValue));
  }
}
