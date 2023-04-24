import {BnBioNetworkNode} from './bn-bio-network-node.class';
import {BnBioNetworkClusterInfo, BnBioNetworkMetabolite, BnBioNetworkMetaboliteLevel} from './bn-bio-network.class';
import {ClHelpService} from '@monorepo/core-lib';


export class BnBioNetworkNodeMetabolite extends BnBioNetworkNode {

  public type: 'metabolite';
  public data: BnBioNetworkMetabolite;

  constructor(name: string, public cluster: BnBioNetworkClusterInfo, public level: BnBioNetworkMetaboliteLevel,
              defaultColor: string, strokeColor: string, data: BnBioNetworkMetabolite,
              public existsInMultipleCluster: boolean) {
    super(name, 'metabolite', defaultColor, strokeColor, data);
  }


  isMajor(): boolean {
    return this._getLevel() === BnBioNetworkMetaboliteLevel.MAJOR;
  }

  protected _getLevel(): BnBioNetworkMetaboliteLevel {
    return this.level;
  }

  isInCluster(id: string): boolean {
    return this.cluster.clusterId === id;
  }

  savePosition(): void {
    const center = this.getCoords();
    const cluster = this.data.layout.clusters[this.cluster.subClusterIds[0]];
    if (cluster) {
      cluster.x = center.x;
      cluster.y = center.y;
    }
  }

  public getChebiId(): string | null {
    return ClHelpService.isNullOrEmpty(this.data.chebi_id) ? null : this.data.chebi_id;
  }
}
