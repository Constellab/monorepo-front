import { ClHelpService } from '@monorepo/core-lib';

import { BnBioNetworkHelper } from '../utils/bn-bio-network.helper';
import { BnBioNetworkLinkHelper } from '../utils/bn-bio-network-link.helper';
import {
  BnBioNetworkClusterInfo,
  BnBioNetworkMetaboliteLevel,
  BnBioNetworkReaction,
} from './bn-bio-network.class';
import { BnBioNetworkNode } from './bn-bio-network-node.class';
import { BnBioNetworkNodeCofactor } from './bn-bio-network-node-cofactor.class';
import { BnBioNetworkNodeMetabolite } from './bn-bio-network-node-metabolite.class';

export class BnBioNetworkNodeReaction extends BnBioNetworkNode {
  public type: 'reaction';
  public data: BnBioNetworkReaction;
  public cluster: BnBioNetworkClusterInfo;

  private readonly cofactorDistance = 20;

  constructor(
    name: string,
    cluster: BnBioNetworkClusterInfo,
    defaultColor: string,
    strokeColor: string,
    data: BnBioNetworkReaction,
    public existsInMultipleCluster: boolean
  ) {
    super(name, 'reaction', defaultColor, strokeColor, data);
    this.cluster = cluster;
  }

  isInCluster(id: string): boolean {
    return this.cluster.clusterId === id;
  }

  // The level of the reaction is the lowest level of connected metabolites
  protected _getLevel(): BnBioNetworkMetaboliteLevel {
    if (this.data.level) return this.data.level;

    // Exclude connected BnBioNetworkD3Reaction to avoid infinite loop
    // ignore cofactors
    const levels: number[] = this.getConnectedNodes()
      .filter(
        (node) => !(node instanceof BnBioNetworkNodeReaction) && !(node instanceof BnBioNetworkNodeCofactor)
      )
      .map((node) => node.getLevel())
      .sort();

    // if there is only 1 level, return it
    if (levels.length === 1) return levels[0];

    // if the reaction is connected to at least 2 major, it is major, otherwise it is minor
    if (levels.filter((l) => l === BnBioNetworkMetaboliteLevel.MAJOR).length >= 2) {
      return BnBioNetworkMetaboliteLevel.MAJOR;
    } else {
      return BnBioNetworkMetaboliteLevel.MINOR;
    }
  }

  /**
   * Set all the cofactors position based on reaction position
   */
  public setCofactorsPositions(): void {
    // init cofactor positions
    const tSpaces = (Math.PI * 2) / this.childNodes.length;
    let t = 0;

    for (const node of this.childNodes) {
      const x = this.cofactorDistance * Math.cos(t) + this.x;
      const y = this.cofactorDistance * Math.sin(t) + this.y;
      node.setPositionAndFreeze({ x, y });
      t += tSpaces;
    }
  }

  public getRheaId(): string | null {
    return ClHelpService.isNullOrEmpty(this.data.rhea_id) ? null : this.data.rhea_id;
  }

  public getReadIdLink(): string | null {
    const rheaId = this.getRheaId();
    return rheaId ? BnBioNetworkLinkHelper.getRheaDatabaseReactionLink(rheaId) : null;
  }

  /**
   * Return the next connected metabolite or cofactor
   */
  public getNextMetabolites(): (BnBioNetworkNodeMetabolite | BnBioNetworkNodeCofactor)[] {
    return this.getNextNodes()
      .filter(
        (node) => node instanceof BnBioNetworkNodeMetabolite || node instanceof BnBioNetworkNodeCofactor
      )
      .map((node) => node as BnBioNetworkNodeMetabolite | BnBioNetworkNodeCofactor);
  }

  /**
   * Return the previous connected metabolite or cofactor
   */
  public getPreviousMetabolites(): (BnBioNetworkNodeMetabolite | BnBioNetworkNodeCofactor)[] {
    return this.getPreviousNodes()
      .filter(
        (node) => node instanceof BnBioNetworkNodeMetabolite || node instanceof BnBioNetworkNodeCofactor
      )
      .map((node) => node as BnBioNetworkNodeMetabolite | BnBioNetworkNodeCofactor);
  }

  /**
   * return the list of same reaction that are in another cluster
   */
  public getSameReactionNodesInOtherCluster(): BnBioNetworkNode[] {
    return this.getConnectedNodes().filter((node) => node instanceof BnBioNetworkNodeReaction);
  }

  public getProductIds(): string[] {
    const ids: string[] = [];
    for (const keys of Object.keys(this.data.metabolites)) {
      if (!BnBioNetworkHelper.metaboliteIsConsumed(keys, this.data)) {
        ids.push(keys);
      }
    }
    return ids;
  }

  public getSubstratIds(): string[] {
    const ids: string[] = [];
    for (const keys of Object.keys(this.data.metabolites)) {
      if (BnBioNetworkHelper.metaboliteIsConsumed(keys, this.data)) {
        ids.push(keys);
      }
    }
    return ids;
  }
}
