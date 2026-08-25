import { ClHelpService } from '@monorepo/core-lib';

import {
  BnBioNetworkClusterInfo,
  BnBioNetworkMetabolite,
  BnBioNetworkMetaboliteLevel,
} from './bn-bio-network.class';
import { BnBioNetworkNode } from './bn-bio-network-node.class';

export class BnBioNetworkNodeMetabolite extends BnBioNetworkNode {
  public type: 'metabolite';
  public data: BnBioNetworkMetabolite;

  constructor(
    name: string,
    public cluster: BnBioNetworkClusterInfo,
    public level: BnBioNetworkMetaboliteLevel,
    defaultColor: string,
    strokeColor: string,
    data: BnBioNetworkMetabolite,
    public existsInMultipleCluster: boolean
  ) {
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
    const layout = this.data.layout;
    if (layout == null || center.x == null || center.y == null) return;

    const cluster = layout.clusters[this.cluster.subClusterIds[0]];
    if (cluster) {
      cluster.x = center.x;
      cluster.y = center.y;
    }
  }

  public getChebiId(): string | null {
    const chebiId = this.data.chebi_id ?? null;
    return ClHelpService.isNullOrEmpty(chebiId) ? null : chebiId;
  }
}
