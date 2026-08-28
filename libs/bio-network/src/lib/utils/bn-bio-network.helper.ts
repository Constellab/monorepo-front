import { ClHelpService } from '@monorepo/core-lib';

import {
  BnBioNetworkClusterInfo,
  bnBioNetworkIsCofactor,
  BnBioNetworkMetabolite,
  BnBioNetworkReaction,
  BnBioNetworkReactionData,
  BnBioNetworkReactionDataFlux,
} from '../model/bn-bio-network.class';

/**
 * Helper class to manipulate {@link BnBioNetwork}
 */
export class BnBioNetworkHelper {
  public static readonly defaultClusterId = 'Default';

  public static getMetaboliteClusters(metabolite: BnBioNetworkMetabolite): BnBioNetworkClusterInfo[] {
    const layoutClusters = metabolite.layout?.clusters;

    if (layoutClusters == null || Object.keys(layoutClusters).length === 0) {
      return [
        {
          clusterId: BnBioNetworkHelper.defaultClusterId,
          subClusterIds: [BnBioNetworkHelper.defaultClusterId],
        },
      ];
    }

    const clusters: BnBioNetworkClusterInfo[] = [];

    for (const [key, value] of Object.entries(layoutClusters)) {
      let cluster = clusters.find((c) => c.clusterId === value.id);

      if (!cluster) {
        cluster = {
          clusterId: value.id,
          subClusterIds: [],
        };
        clusters.push(cluster);
      }
      cluster.subClusterIds.push(key);
    }

    return clusters;
  }

  public static getReactionClusters(
    reaction: BnBioNetworkReaction,
    metabolites: BnBioNetworkMetabolite[]
  ): BnBioNetworkClusterInfo[] {
    const clusters: BnBioNetworkClusterInfo[] = [];

    // the reaction is the clusters of all metabolites associated to the reaction (excluding the cofactors)
    for (const metaboliteId of Object.keys(reaction.metabolites)) {
      const metabolite: BnBioNetworkMetabolite | undefined = metabolites.find((m) => m.id === metaboliteId);
      if (!metabolite || bnBioNetworkIsCofactor(metabolite.type)) continue;

      const metabolitesClusters = BnBioNetworkHelper.getMetaboliteClusters(metabolite);
      for (const cluster of metabolitesClusters) {
        const reactionCluster = clusters.find((c) => c.clusterId === cluster.clusterId);
        // add the metabolite cluster to the reaction cluster
        if (!reactionCluster) {
          clusters.push(ClHelpService.deepClone(cluster));
        } else {
          // todo merge sub cluster ids and remove duplicate
          reactionCluster.subClusterIds = reactionCluster.subClusterIds.concat(cluster.subClusterIds);
        }
      }
    }

    // set the default cluster at last position
    return clusters.sort((cluster) => (cluster.clusterId === BnBioNetworkHelper.defaultClusterId ? 1 : -1));
  }

  /**
   * Return true if the metabolite is consumed in a reaction.
   */
  public static metaboliteIsConsumed(metaboliteId: string, reaction: BnBioNetworkReaction): boolean {
    const simulation = BnBioNetworkHelper.getReactionSimulationValue(reaction.data);
    // if the simulation value is negative, the link is inverted
    return simulation * reaction.metabolites[metaboliteId] < 0;
  }

  public static metaboliteValueIsConsumed(value: number): boolean {
    return value < 0;
  }

  public static getReactionSimulationValue(reactionData: BnBioNetworkReactionData): number {
    const simulation = BnBioNetworkHelper.getReactionFlux(reactionData);
    return simulation && typeof simulation.value === 'number' ? simulation.value : 1;
  }

  public static getReactionFlux(reactionData: BnBioNetworkReactionData): BnBioNetworkReactionDataFlux | null {
    const simulations = reactionData.simulations;
    if (simulations == null || ClHelpService.isNullOrEmpty(simulations)) return null;
    return Object.values(simulations)[0];
  }
}
