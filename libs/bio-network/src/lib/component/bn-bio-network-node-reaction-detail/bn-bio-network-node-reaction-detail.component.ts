import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { BnBioNetworkNode } from '../../model/bn-bio-network-node.class';
import { BnBioNetworkNodeReaction } from '../../model/bn-bio-network-node-reaction.class';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';
import { BnBioNetworkSelectionState } from '../../state/bn-bio-network-selection.state';

/**
 * Detail information about one reaction node
 */
@Component({
  selector: 'bn-bio-network-node-reaction-detail',
  templateUrl: './bn-bio-network-node-reaction-detail.component.html',
  styleUrls: ['./bn-bio-network-node-reaction-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BnBioNetworkNodeReactionDetailComponent implements OnInit {
  private drawerState = inject(BnBioNetworkDrawerState);
  private state = inject(BnBioNetworkState);
  private selectionState = inject(BnBioNetworkSelectionState);

  node$: Observable<BnBioNetworkNodeReaction>;

  // list of the same metabolite node
  duplicateReactions$: Observable<BnBioNetworkNodeReaction[]>;

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(
      filter((state) => state.selectedNode instanceof BnBioNetworkNodeReaction),
      map((state) => state.selectedNode as BnBioNetworkNodeReaction)
    );

    // retrieve all the nodes with the same reaction id
    this.duplicateReactions$ = this.node$.pipe(
      switchMap((node) =>
        this.state
          .getChartData$()
          .pipe(map((chartData) => chartData?.getReactionNodesByObjectId(node.data.id) ?? []))
      )
    );
  }

  selectNode(node: BnBioNetworkNode): void {
    this.selectionState.selectNode(node, 'singleNode');
  }
}
