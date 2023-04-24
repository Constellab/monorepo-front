import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

import {filter, map, switchMap} from 'rxjs/operators';
import {BnBioNetworkNodeReaction} from '../../model/bn-bio-network-node-reaction.class';
import {BnBioNetworkDrawerState} from '../../state/bn-bio-network-drawer.state';
import {BnBioNetworkState} from '../../state/bn-bio-network.state';
import {BnBioNetworkSelectionState} from '../../state/bn-bio-network-selection.state';
import {BnBioNetworkNode} from '../../model/bn-bio-network-node.class';

/**
 * Detail information about one reaction node
 */
@Component({
  selector: 'bn-bio-network-node-reaction-detail',
  templateUrl: './bn-bio-network-node-reaction-detail.component.html',
  styleUrls: ['./bn-bio-network-node-reaction-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BnBioNetworkNodeReactionDetailComponent implements OnInit {

  node$: Observable<BnBioNetworkNodeReaction>;

  // list of the same metabolite node
  duplicateReactions$: Observable<BnBioNetworkNodeReaction[]>;


  constructor(private drawerState: BnBioNetworkDrawerState,
              private state: BnBioNetworkState,
              private selectionState: BnBioNetworkSelectionState) {
  }

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(
      filter(state => state.selectedNode instanceof BnBioNetworkNodeReaction),
      map(state => state.selectedNode as BnBioNetworkNodeReaction),
    );

    // retrieve all the nodes with the same reaction id
    this.duplicateReactions$ = this.node$.pipe(
      switchMap(node => this.state.getChartData$().pipe(
        map(chartData => chartData?.getReactionNodesByObjectId(node.data.id) ?? [])
      )));
  }

  selectNode(node: BnBioNetworkNode): void {
    this.selectionState.selectNode(node, 'singleNode');
  }

}
