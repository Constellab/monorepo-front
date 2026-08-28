import { FlCoord, FlCoordHelper } from '@monorepo/front-core-lib/fl-core';
import { curveCatmullRom, line, select, SimulationLinkDatum } from 'd3';

import { BnBioNetworkMetaboliteLevel } from './bn-bio-network.class';
import { BnBioNetworkGraphObject } from './bn-bio-network-graph.class';
import { BnBioNetworkNode, BnBioNetworkNodeCoord } from './bn-bio-network-node.class';
import { BnBioNetworkNodeCofactor } from './bn-bio-network-node-cofactor.class';
import { BnBioNetworkNodeReaction } from './bn-bio-network-node-reaction.class';

// const lineFunction = line<FlCoord>().x(d => d.x).y(d => d.y);
// const lineFunction = line<FlCoord>().x(d => d.x).y(d => d.y).curve(curveStep);
const lineFunction = line<FlCoord>()
  .x((d) => d.x)
  .y((d) => d.y)
  .curve(curveCatmullRom.alpha(1));

export class BnBioNetworkLinkPoint implements FlCoord {
  private static id: number = 0;

  id: number;

  constructor(
    public x: number,
    public y: number,
    public link: BnBioNetworkLink
  ) {
    this.id = BnBioNetworkLinkPoint.id++;
  }

  public setCoord(coord: FlCoord): void {
    this.x = coord.x;
    this.y = coord.y;
    // this.link.savePoints();
  }

  public toCoord(): FlCoord {
    return {
      x: this.x,
      y: this.y,
    };
  }

  public delete(): void {
    this.link.deletePoint(this.id);
  }
}

export type BnBioNetworkLinkType = 'link' | 'cofactor-link' | 'cross-cluster-link';

export class BnBioNetworkLink
  extends BnBioNetworkGraphObject
  implements SimulationLinkDatum<BnBioNetworkNode>
{
  private static id: number = 0;

  id: number;

  source: BnBioNetworkNode;
  target: BnBioNetworkNode;

  pointPositions: BnBioNetworkLinkPoint[] = [];

  // group element containing the link (path) and the points (circles)
  groupElement: SVGGElement;

  value: number;
  absValue: number;

  isVisible: boolean = true;

  constructor(
    source: BnBioNetworkNode,
    target: BnBioNetworkNode,
    fluxValue: number,
    public defaultColor: string,
    public type: BnBioNetworkLinkType
  ) {
    super();
    this.source = source;
    this.target = target;
    this.id = BnBioNetworkLink.id++;

    // init each points
    // if (points) {
    //   points.forEach(point => this.pointPositions.push(new BnBioNetworkLinkPoint(point.x, point.y, this)));
    // }

    // add the link to the source and target
    this.source.departureLinks.push(this);
    this.target.arrivalLinks.push(this);

    this.value = fluxValue ? fluxValue : 0;
    this.absValue = Math.abs(this.value);
  }

  get absLog2Value(): number {
    return Math.log2(this.absValue + 1.5);
  }

  get log2Value(): number {
    return this.value > 0 ? this.absLog2Value : -this.absLog2Value;
  }

  get absLog10Value(): number {
    return Math.log10(this.absValue + 1.5);
  }

  ////////////////////////////////////// NODES //////////////////////////////////////

  isLinkedToNode(nodeId: number): boolean {
    return this.source.id === nodeId || this.target.id === nodeId;
  }

  isLinkedToAnyNode(nodeIds: number[]): boolean {
    return nodeIds.some((nodeIndex) => this.isLinkedToNode(nodeIndex));
  }

  // return true if the link is linked to a cofactor
  isLinkedToCofactor(): boolean {
    return this.source instanceof BnBioNetworkNodeCofactor || this.target instanceof BnBioNetworkNodeCofactor;
  }

  ////////////////////////////////////// POINTS //////////////////////////////////////
  public getPathAttr(): string | null {
    if (!this.source.hasPositions() || !this.target.hasPositions()) return null;
    // the source/target positions are checked above, so every point is fully defined
    const points: FlCoord[] = this.getPathPoints().filter(
      (point): point is FlCoord => point.x != null && point.y != null
    );
    return lineFunction(points);
  }

  public getPathPoints(): BnBioNetworkNodeCoord[] {
    const startCoord: BnBioNetworkNodeCoord = this.source.getCoords();
    const endCoord: BnBioNetworkNodeCoord = this.target.getCoords();
    return [startCoord, ...this.pointPositions, endCoord];
  }

  /**
   * Insert a new point in the points. It calculates where to insert the points
   * @param coord
   */
  public insertPoint(coord: FlCoord): void {
    const point: BnBioNetworkLinkPoint = new BnBioNetworkLinkPoint(coord.x, coord.y, this);

    if (this.pointPositions.length === 0) {
      this.pointPositions.push(point);
    } else {
      // get all points including the source and target
      // an unpositioned extremity gives NaN distances, like the arithmetic on undefined did
      const points: FlCoord[] = [
        { x: this.source.x ?? NaN, y: this.source.y ?? NaN },
        ...this.pointPositions,
        {
          x: this.target.x ?? NaN,
          y: this.target.y ?? NaN,
        },
      ];
      // we have to insert the point at a logical position
      let minDist = Infinity;
      let minDistIndex = -1;
      for (let i = 0; i < points.length - 1; i++) {
        // dist between the point and the segment i,  i+1
        const dist = FlCoordHelper.distToSegment(coord, points[i], points[i + 1]);
        if (dist < minDist) {
          minDist = dist;
          minDistIndex = i;
        }
      }
      // insert point at the right position
      this.pointPositions.splice(minDistIndex, 0, point);
    }

    // this.savePoints();
  }

  public deletePoint(id: number): void {
    const index = this.pointPositions.findIndex((point) => point.id === id);
    if (index !== -1) {
      this.pointPositions.splice(index, 1);
      // this.savePoints();
    }

    // remove the circle element
    select(this.groupElement)
      .selectAll('circle')
      .filter((d: BnBioNetworkLinkPoint) => d.id === id)
      .remove();
  }

  // public pointsToCoords(): FlCoord[] {
  //   return this.pointPositions.map(point => point.toCoord());
  // }

  // save the coord points to the reaction
  // public savePoints(): void {
  //   const reaction = this.reaction;
  //   const metabolite = this.metabolite;
  //   if (reaction) {
  //     if (!reaction.data.metabolites[metabolite.data.id]) {
  //       console.error(`Can't find the metabolite ${metabolite.name} in reaction ${reaction.name}`);
  //       return;
  //     }
  //     reaction.data.metabolites[metabolite.data.id].points = this.pointsToCoords();
  //   }
  // }

  public get reaction(): BnBioNetworkNodeReaction | null {
    if (this.target instanceof BnBioNetworkNodeReaction) return this.target;
    if (this.source instanceof BnBioNetworkNodeReaction) return this.source;
    return null;
  }

  public get metabolite(): BnBioNetworkNode | null {
    if (this.target instanceof BnBioNetworkNodeReaction) return this.source;
    if (this.source instanceof BnBioNetworkNodeReaction) return this.target;
    return null;
  }

  // returns NaN while one of the extremities has no position yet
  public getLength(): number {
    const source = this.source.getCoords();
    const target = this.target.getCoords();
    return Math.sqrt(
      ((source.x ?? NaN) - (target.x ?? NaN)) ** 2 + ((source.y ?? NaN) - (target.y ?? NaN)) ** 2
    );
  }

  protected _getLevel(): BnBioNetworkMetaboliteLevel {
    // the link takes the highest level of the connected nodes
    return Math.max(this.source.getLevel(), this.target.getLevel());
  }

  public isInCluster(id: string): boolean {
    return this.target.isInCluster(id) || this.source.isInCluster(id);
  }
}
