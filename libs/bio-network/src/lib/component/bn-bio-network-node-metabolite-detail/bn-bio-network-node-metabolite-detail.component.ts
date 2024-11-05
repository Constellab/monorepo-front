import { Component, OnInit } from '@angular/core';

import { filter, map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BnBioNetworkNodeMetabolite } from '../../model/bn-bio-network-node-metabolite.class';
import { BnBioNetworkNodeReaction } from '../../model/bn-bio-network-node-reaction.class';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetworkSelectionState } from '../../state/bn-bio-network-selection.state';
import { BnBioNetworkNode } from '../../model/bn-bio-network-node.class';

/**
 * Detail information about one metabolite node
 */
@Component({
  selector: 'bn-bio-network-node-metabolite-detail',
  templateUrl: './bn-bio-network-node-metabolite-detail.component.html',
  styleUrls: ['./bn-bio-network-node-metabolite-detail.component.scss'],
})
export class BnBioNetworkNodeMetaboliteDetailComponent implements OnInit {
  node$: Observable<BnBioNetworkNodeMetabolite>;

  // list of the same metabolite node
  duplicateMetabolites$: Observable<BnBioNetworkNodeMetabolite[]>;

  connectedReaction$: Observable<BnBioNetworkNodeReaction[]>;

  constructor(
    private drawerState: BnBioNetworkDrawerState,
    private state: BnBioNetworkState,
    private selectionState: BnBioNetworkSelectionState
  ) {}

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(
      filter((state) => state.selectedNode instanceof BnBioNetworkNodeMetabolite),
      map((state) => state.selectedNode as BnBioNetworkNodeMetabolite)
    );

    // retrieve all the nodes with the same metabolite id
    this.duplicateMetabolites$ = this.node$.pipe(
      switchMap((node) =>
        this.state
          .getChartData$()
          .pipe(map((chartData) => chartData?.getMetaboliteNodesByObjectId(node.data.id) ?? []))
      )
    );

    // retrieve all the reactions connected to the metabolite
    this.connectedReaction$ = this.node$.pipe(
      map((node) => (node?.getConnectedNodes() as BnBioNetworkNodeReaction[]) ?? [])
    );
  }

  selectNode(node: BnBioNetworkNode): void {
    this.selectionState.selectNode(node, 'singleNode');
  }
}
