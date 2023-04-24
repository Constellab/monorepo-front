import {BnBioNetworkNodeMetabolite} from './bn-bio-network-node-metabolite.class';
import {BnBioNetworkNodeReaction} from './bn-bio-network-node-reaction.class';
import {BnBioNetworkNodeCofactor} from './bn-bio-network-node-cofactor.class';
import {BnBioNetworkLink} from './bn-bio-network-node-link.class';
import {BnBioNetworkNode} from './bn-bio-network-node.class';
import {BnBioNetworkMetaboliteLevel, BnBioNetworkObject} from './bn-bio-network.class';


/**
 * Data used to construct to d3 network
 */
export class BnBioNetworkGraph {

  constructor(public metabolites: BnBioNetworkNodeMetabolite[],
              public reactions: BnBioNetworkNodeReaction[],
              public cofactors: BnBioNetworkNodeCofactor[],
              public links: BnBioNetworkLink[],
              // link between the same reaction of 2 different clusters
              public interClusterLinks: BnBioNetworkLink[]) {
  }

  /**
   * return all the nodes
   */
  public getAllNodes(): BnBioNetworkNode[] {
    return [...this.getMetaboliteAndCofactors(), ...this.reactions];
  }

  public getMetabolitesAndReactions(): BnBioNetworkNode[] {
    return [...this.metabolites, ...this.reactions];
  }

  /**
   * return all the metabolites nodes
   */
  public getMetaboliteAndCofactors(): (BnBioNetworkNodeMetabolite | BnBioNetworkNodeCofactor)[] {
    return [...this.metabolites, ...this.cofactors];
  }

  // return all the nodes of a level
  public getNodes(level: BnBioNetworkMetaboliteLevel): BnBioNetworkNode[] {
    return this.getAllNodes().filter(link => link.getLevel() === level);
  }

  // return basic links and the links between the same reaction of 2 different clusters
  public getAllLinks(): BnBioNetworkLink[] {
    return [...this.links, ...this.interClusterLinks];
  }

  // return all the link of a level
  public getLinks(level: BnBioNetworkMetaboliteLevel): BnBioNetworkLink[] {
    return this.links.filter(link => link.getLevel() === level);
  }

  public getMetaboliteAndReactionLinks(): BnBioNetworkLink[] {
    return this.links.filter(link => link.getLevel() !== BnBioNetworkMetaboliteLevel.COFACTOR);
  }

  public getAllObjects(): BnBioNetworkGraphObject[] {
    return [...this.getAllNodes(), ...this.links];
  }

  public getNormalLinks(): BnBioNetworkLink[] {
    return this.links.filter(link => link.type === 'link');
  }

  public getCrossClusterLinks(): BnBioNetworkLink[] {
    return this.links.filter(link => link.type === 'cross-cluster-link');
  }

  // return the min and max value of all links
  public getLinksDomain(): [number, number] {
    let min: number = 0;
    let max: number = 0;

    for (const link of this.links) {
      if (link.value > max) {
        max = link.value;
      } else if (link.value < min) {
        min = link.value;
      }
    }

    return [min, max];
  }

  public getLinksValues(): number[] {
    return this.links.map(link => link.absValue);
  }

  // return the max value of all links
  public getLinksMaxAbsoluteValue(): number {
    return Math.max(...this.links.map(link => link.absValue));
  }

  public allNodesHavePositions(): boolean {
    return this.metabolites.every(metabolite => metabolite.x != null && metabolite.y != null) &&
      this.reactions.every(reaction => reaction.x != null && reaction.y != null);
    // true if the node have a position, in this case, no need to launch simulation
    // return this.metabolites[0]?.x != null && this.metabolites[0]?.x !== 0;
  }

  public savePositions(): void {
    this.getMetabolitesAndReactions().forEach(node => node.savePosition());
  }

  public initPositions(): void {
    this.getAllNodes().forEach(node => node.initPosition());
  }

  // return the lowest level of objects
  public getLowestLevel(): number {
    return Math.min(...this.getAllNodes().map(node => node.getLevel()));
  }

  /**
   * return the metabolite data (not the nodes) and not duplicated
   */
  public getMetabolitesAndReactionData(): BnBioNetworkObject[] {
    const metabolitesData: BnBioNetworkObject[] = [];
    for (const metabolite of this.metabolites) {
      if (metabolitesData.find(metaboliteData => metaboliteData.id === metabolite.data.id) == null) {
        metabolitesData.push(metabolite.data);
      }
    }
    for (const reaction of this.reactions) {
      if (metabolitesData.find(metaboliteData => metaboliteData.id === reaction.data.id) == null) {
        metabolitesData.push(reaction.data);
      }
    }
    return metabolitesData;
  }

  public getMetaboliteNodesByObjectId(metaboliteId: string): BnBioNetworkNodeMetabolite[] {
    return this.metabolites.filter(node => node.data.id === metaboliteId);
  }

  public getReactionNodesByObjectId(reactionId: string): BnBioNetworkNodeReaction[] {
    return this.reactions.filter(node => node.data.id === reactionId);
  }

  public getMetaboliteAndReactionNodesByObjectId(objectId: string): BnBioNetworkNode[] {
    return [...this.getMetaboliteNodesByObjectId(objectId), ...this.getReactionNodesByObjectId(objectId)];
  }

  /**
   * Set all the cofactors position based on reaction position
   */
  public setCofactorsPositions(): void {
    for (const reaction of this.reactions) {

      reaction.setCofactorsPositions();
    }
  }
}

// Any object in the network
export abstract class BnBioNetworkGraphObject {

  // use to store the level if there is some calculation
  protected _level: number;

  // set to true when the object is selected (highlighted)
  public selected: boolean = false;


  defaultColor: string;

  public getLevel(): BnBioNetworkMetaboliteLevel {
    if (this._level == null) {
      this._level = this._getLevel();
    }
    return this._level;
  }

  // the lower the level, the most important the node is
  // level for the zoom
  protected abstract _getLevel(): BnBioNetworkMetaboliteLevel;

  public abstract isInCluster(id: string): boolean;


}
