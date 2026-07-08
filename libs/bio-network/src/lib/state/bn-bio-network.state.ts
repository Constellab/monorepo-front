import { inject, Injectable, OnDestroy } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlColorHelper } from '@monorepo/front-core-lib/fl-core';
import { FlThemeService } from '@monorepo/front-core-lib/fl-theme';
import { FlFileHelper, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

import {
  BnBioNetwork,
  BnBioNetworkClusterSelection,
  BnBioNetworkCompartment,
  BnPathwayDatabase,
} from '../model/bn-bio-network.class';
import { BnBioNetworkGraph } from '../model/bn-bio-network-graph.class';
import { BnBioNetworkFactory } from '../utils/bn-bio-network.factory';
import { BnBioNetworkHelper } from '../utils/bn-bio-network.helper';
import { BnBioNetworkEngineState } from './bn-bio-network-engine.state';

/**
 * State containing the data for the pathway
 */
@Injectable()
export class BnBioNetworkState implements OnDestroy {
  private translateService = inject(FlTranslateService);
  private themeService = inject(FlThemeService);
  private engineState = inject(BnBioNetworkEngineState);

  public networks: BnBioNetwork[];
  private selectedNetwork$: BehaviorSubject<BnBioNetwork | null>;
  private chartData$: BehaviorSubject<BnBioNetworkGraph | null>;
  // private database$: BehaviorSubject<BnPathwayDatabase | null>;

  private clusters$: BehaviorSubject<BnBioNetworkClusterSelection[]>;
  private clustersSelectionChange$: BehaviorSubject<void>;

  // used to cache the list of pathway
  private pathwayListCache: Record<BnPathwayDatabase | string, BnBioNetworkClusterSelection[]>;

  public init(networks: BnBioNetwork | BnBioNetwork[]): void {
    this.initNetworks(networks);

    this.selectedNetwork$ = new BehaviorSubject(this.networks[0]);
    this.chartData$ = new BehaviorSubject(null);
    // this.database$ = new BehaviorSubject(null);
    this.clusters$ = new BehaviorSubject([]);
    this.clustersSelectionChange$ = new BehaviorSubject(null);

    this.pathwayListCache = {};

    // load the db and the list of pathways
    this.selectDatabase();

    this.clustersSelectionChange$
      .pipe(
        // use a debounce time to prevent rebuilding the graph to much
        debounceTime(500)
      )
      .subscribe(() => this.selectClusters(this.clusters$.value));
  }

  private initNetworks(networks: BnBioNetwork | BnBioNetwork[]): void {
    const networksArray: BnBioNetwork[] = ClHelpService.convertObjectOrArrayToArray(networks);

    // set a default name to the networks if they don't have a name
    for (let i = 0; i < networksArray.length; i++) {
      if (ClHelpService.isNullOrEmpty(networksArray[i].name)) {
        networksArray[i].name = this.translateService.translate('bnBioNetwork.network') + ' ' + (i + 1);
      }
    }
    this.networks = networksArray;
  }

  /////////////////////////////////////// NETWORKS /////////////////////////////////////////

  public selectNetwork(name: string): void {
    // find the network with the name
    const network: BnBioNetwork = this.networks.find((network) => network.name === name);
    this.selectedNetwork$.next(network);
    this.clusters$.next([]);
    this.emitClustersSelectionChange();
  }

  public getSelectedNetwork(): BnBioNetwork {
    return this.selectedNetwork$.value;
  }

  /////////////////////////////////////// DATABASE  /////////////////////////////////////////

  public selectDatabase(): void {
    // this.database$.next(database);

    const clusterList: BnBioNetworkClusterSelection[] = this.getClustersList();
    this.clusters$.next(clusterList);

    // if there is only one pathway, select it by default
    if (clusterList.length === 1) {
      this.selectClusters([clusterList[0]]);
    }

    this.emitClustersSelectionChange();
  }

  //
  // public getDatabase$(): Observable<BnPathwayDatabase> {
  //   return this.database$.asObservable();
  // }

  public getDatabase(): BnPathwayDatabase {
    return 'kegg';
    // return this.database$.value;
  }

  /////////////////////////////////////// CLUSTERS  /////////////////////////////////////////

  // select specific cluster in the network to display
  private selectClusters(clusters: BnBioNetworkClusterSelection[]): void {
    clusters.forEach((cluster) => (cluster.highlighted = false));
    const clusterIds: string[] = clusters.filter((cluster) => cluster.selected).map((cluster) => cluster.id);
    // if no ids are selected, we return null
    if (
      ClHelpService.isNullOrEmpty(clusterIds) ||
      this.getDatabase() == null ||
      this.getSelectedNetwork() == null
    ) {
      this.chartData$.next(null);
      return;
    }

    const factory = new BnBioNetworkFactory(
      this.themeService.getCurrentThemeDetail(),
      this.engineState.engineConfig.ignoreNodePositions
    );
    const chartData: BnBioNetworkGraph = factory.convertNetworkToNetworkD3(
      this.getSelectedNetwork(),
      clusterIds
    );

    this.chartData$.next(chartData);
  }

  public selectAllClusters(): void {
    this.getCurrentClusters().forEach((cluster) => (cluster.selected = true));
    this.emitClustersSelectionChange();
  }

  public unselectAllClusters(): void {
    this.getCurrentClusters().forEach((cluster) => {
      cluster.selected = false;
      cluster.highlighted = false;
    });
    this.emitClustersSelectionChange();
  }

  private getClustersList(): BnBioNetworkClusterSelection[] {
    if (this.getSelectedNetwork() == null) {
      return [];
    }

    const network = this.getSelectedNetwork();
    const clusters: BnBioNetworkClusterSelection[] = [];

    clusters.push({
      id: BnBioNetworkHelper.defaultClusterId,
      name: BnBioNetworkHelper.defaultClusterId,
      color: FlColorHelper.stringToRGBColor(BnBioNetworkHelper.defaultClusterId),
      highlighted: false,
      selected: false,
    });
    for (const metabolite of network.metabolites) {
      for (const cluster of Object.values(metabolite.layout.clusters)) {
        if (clusters.find((c) => c.id === cluster.id) == null) {
          clusters.push({
            id: cluster.id,
            name: cluster.name,
            selected: false,
            highlighted: false,
            color: FlColorHelper.stringToRGBColor(cluster.id),
          });
        }
      }
    }

    return clusters;
  }

  // private getClustersGroup(): BnBioNetworkClusterGroupSelection[] {
  //   const network = this.getSelectedNetwork();
  //   if (network == null) {
  //     return [];
  //   }
  //   const groups: BnBioNetworkClusterGroupSelection[] = [];
  //
  //   for (const metabolite of network.metabolites) {
  //
  //     for (const clusterName of Object.keys(metabolite.layout.clusters)) {
  //       const cluster: BnBioNetworkCluster = metabolite.layout.clusters[clusterName];
  //       let parent = groups.find(g => g.name === cluster.parent);
  //       if (parent == null) {
  //         parent = {
  //           name: cluster.parent,
  //           children: [],
  //         };
  //         groups.push(parent);
  //       }
  //
  //       const child = parent.children.find(c => c.name === clusterName);
  //       if (child == null) {
  //         parent.children.push({name: clusterName});
  //       }
  //     }
  //   }
  //
  //   return groups;
  // }

  public emitClustersSelectionChange(): void {
    this.clustersSelectionChange$.next();
  }

  public getClusters$(): Observable<BnBioNetworkClusterSelection[]> {
    return this.clusters$.asObservable();
  }

  public getCurrentClusters(): BnBioNetworkClusterSelection[] {
    return this.clusters$.value;
  }

  /////////////////////////////////////// CHART DATA /////////////////////////////////////////
  public getChartData$(): Observable<BnBioNetworkGraph | null> {
    return this.chartData$.asObservable();
  }

  public getCurrentChartData(): BnBioNetworkGraph | null {
    return this.chartData$.value;
  }

  public downloadNetworkJson(): void {
    const network: BnBioNetwork = this.exportAllNetwork();

    // TODO to remove, this is temporary to export a view object
    const viewObject = {
      type: 'network-view',
      data: network,
    };

    FlFileHelper.downloadJsonFile(viewObject, 'network.json');
  }

  public exportAllNetwork(): BnBioNetwork {
    return this.getSelectedNetwork();
  }

  /////////////////////////////////////// OTHER /////////////////////////////////////////

  public getCompartments$(): Observable<BnBioNetworkCompartment[]> {
    return this.selectedNetwork$.pipe(map((network) => network.compartments));
  }

  ngOnDestroy(): void {
    this.selectedNetwork$.complete();
    this.chartData$.complete();
    // this.database$.complete();

    this.clusters$.complete();
    this.clustersSelectionChange$.complete();
  }
}
