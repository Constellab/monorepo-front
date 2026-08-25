import { ClHelpService } from '@monorepo/core-lib';

import { BnBioNetworkMetabolite, BnBioNetworkMetaboliteLevel } from './bn-bio-network.class';
import { BnBioNetworkNode } from './bn-bio-network-node.class';
import { BnBioNetworkNodeReaction } from './bn-bio-network-node-reaction.class';

export const BN_BIO_NETWORK_COFACTOR_COLOR = '#ffaa33';

export class BnBioNetworkNodeCofactor extends BnBioNetworkNode {
  public type: 'cofactor';

  public data: BnBioNetworkMetabolite;

  public parentNode: BnBioNetworkNodeReaction;

  constructor(name: string, defaultColor: string, data: BnBioNetworkMetabolite) {
    super(name, 'cofactor', BN_BIO_NETWORK_COFACTOR_COLOR, defaultColor, data);
  }

  protected _getLevel(): BnBioNetworkMetaboliteLevel {
    return BnBioNetworkMetaboliteLevel.COFACTOR;
  }

  isInCluster(id: string): boolean {
    // check if any connected reaction is in the cluster
    return this.getConnectedNodes()
      .filter((n) => n instanceof BnBioNetworkNodeReaction)
      .some((n) => n.isInCluster(id));
    // the cofactors do not have a cluster, so we return false
    // return false;
  }

  /**
   * Function to decide whether to show the cofactor
   * Only shows it if the parent reaction is selected and the reaction is visible based on levels
   * @param visibleLevels
   */
  showCofactor(visibleLevels: BnBioNetworkMetaboliteLevel[]): boolean {
    return this.parentNode.selected && visibleLevels.includes(this.parentNode.getLevel());
  }

  public getChebiId(): string | null {
    const chebiId = this.data.chebi_id ?? null;
    return ClHelpService.isNullOrEmpty(chebiId) ? null : chebiId;
  }
}
