import { ChangeDetectionStrategy,Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { BnBioNetworkNode } from '../../model/bn-bio-network-node.class';
import { BnBioNetworkNodeMetabolite } from '../../model/bn-bio-network-node-metabolite.class';
import { BnBioNetworkNodeReaction } from '../../model/bn-bio-network-node-reaction.class';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';
import { BnBioNetworkSelectionState } from '../../state/bn-bio-network-selection.state';

/**
 * Detail information about one metabolite node
 */
@Component({
  selector: 'bn-bio-network-node-metabolite-detail',
  templateUrl: './bn-bio-network-node-metabolite-detail.component.html',
  styleUrls: ['./bn-bio-network-node-metabolite-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BnBioNetworkNodeMetaboliteDetailComponent implements OnInit {
  private drawerState = inject(BnBioNetworkDrawerState);
  private state = inject(BnBioNetworkState);
  private selectionState = inject(BnBioNetworkSelectionState);

  node$: Observable<BnBioNetworkNodeMetabolite>;

  // list of the same metabolite node
  duplicateMetabolites$: Observable<BnBioNetworkNodeMetabolite[]>;

  connectedReaction$: Observable<BnBioNetworkNodeReaction[]>;

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
