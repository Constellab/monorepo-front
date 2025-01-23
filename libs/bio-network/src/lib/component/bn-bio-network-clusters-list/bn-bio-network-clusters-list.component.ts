import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetworkOptionsState } from '../../state/bn-bio-network-options.state';
import { BnBioNetworkClusterSelection } from '../../model/bn-bio-network.class';
import { MatSelectChange } from '@angular/material/select';

/**
 * Show the list of cluster with possibility to select them and color them
 */
@Component({
  selector: 'bn-bio-network-clusters-list',
  templateUrl: './bn-bio-network-clusters-list.component.html',
  styleUrls: ['./bn-bio-network-clusters-list.component.scss'],
  standalone: false,
})
export class BnBioNetworkClustersListComponent implements OnInit {
  private state = inject(BnBioNetworkState);
  private optionState = inject(BnBioNetworkOptionsState);

  clusters$: Observable<BnBioNetworkClusterSelection[]>;
  clustersAllSelected: boolean = false;

  ngOnInit(): void {
    // if there is multiple network we set the list to add a mat-select
    this.clusters$ = this.state.getClusters$();
  }

  onNetworkChange(change: MatSelectChange): void {
    this.state.selectNetwork(change.value);
  }

  /////////////////////// CLUSTER SELECTION ///////////////////////

  selectionChanged(cluster: BnBioNetworkClusterSelection): void {
    // when unselecting the pathway, force the highlight to false
    if (!cluster.selected) {
      cluster.highlighted = false;
    }
    this.state.emitClustersSelectionChange();
    this.emitClusterColored();
  }

  selectAllClustersChange(select: boolean): void {
    this.clustersAllSelected = select;
    if (select) {
      this.state.selectAllClusters();
    } else {
      this.state.unselectAllClusters();
    }

    this.emitClusterColored();
  }

  private getSelectedClusters(): BnBioNetworkClusterSelection[] {
    return this.state.getCurrentClusters().filter((cluster) => cluster.selected);
  }

  ////////////////// COLOR //////////////////

  toggleClusterColor(cluster: BnBioNetworkClusterSelection): void {
    cluster.highlighted = !cluster.highlighted;

    this.emitClusterColored();
  }

  toggleAllClusterColors(): void {
    const selectedClusters: BnBioNetworkClusterSelection[] = this.getSelectedClusters();

    if (!this.clustersAllColored) {
      selectedClusters.forEach((cluster) => (cluster.highlighted = true));
    } else {
      selectedClusters.forEach((cluster) => (cluster.highlighted = false));
    }
    this.emitClusterColored();
  }

  private emitClusterColored(): void {
    this.optionState.setColoredClusters(this.getSelectedClusters().filter((cluster) => cluster.highlighted));
  }

  get clustersAllColored(): boolean {
    const selectedClusters: BnBioNetworkClusterSelection[] = this.getSelectedClusters();
    return selectedClusters.length > 0 && selectedClusters.every((cluster) => cluster.highlighted);
  }
}
