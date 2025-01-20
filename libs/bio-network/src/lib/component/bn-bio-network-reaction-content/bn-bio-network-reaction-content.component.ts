import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, Observable, of, switchMap } from 'rxjs';
import { BnBioNetworkState } from '../../state/bn-bio-network.state';
import { BnBioNetworkNodeReaction } from '../../model/bn-bio-network-node-reaction.class';
import { map } from 'rxjs/operators';
import { BnBioNetworkGraph } from '../../model/bn-bio-network-graph.class';
import { BnBioNetworkSelectionState } from '../../state/bn-bio-network-selection.state';
import { BnBioNetworkMetabolite } from '../../model/bn-bio-network.class';

/**
 * Section to display the substrate and products of a reaction
 */
@Component({
    selector: 'bn-bio-network-reaction-content',
    templateUrl: './bn-bio-network-reaction-content.component.html',
    styleUrls: ['./bn-bio-network-reaction-content.component.scss'],
    standalone: false
})
export class BnBioNetworkReactionContentComponent implements OnInit {
  @Input() reaction$: Observable<BnBioNetworkNodeReaction>;

  reactionSubstrate$: Observable<BnBioNetworkMetabolite[]>;
  reactionProducts$: Observable<BnBioNetworkMetabolite[]>;

  constructor(
    private state: BnBioNetworkState,
    private selectionState: BnBioNetworkSelectionState
  ) {}

  ngOnInit(): void {
    this.reactionSubstrate$ = this.reaction$.pipe(
      switchMap((node) => this.getRelatedMetabolite(node, 'substrat'))
    );

    this.reactionProducts$ = this.reaction$.pipe(
      switchMap((node) => this.getRelatedMetabolite(node, 'product'))
    );
  }

  private getRelatedMetabolite(
    reaction: BnBioNetworkNodeReaction,
    type: 'product' | 'substrat'
  ): Observable<BnBioNetworkMetabolite[]> {
    if (reaction == null) return of([]);

    return this.state
      .getChartData$()
      .pipe(map((chartData) => this.getReactionContent(reaction, chartData, type)));
  }

  /**
   * Get the list of metabolite object (not node, it ignores the cluster) related to the reaction
   * @param reaction
   * @param chartData
   * @param type
   * @private
   */
  private getReactionContent(
    reaction: BnBioNetworkNodeReaction,
    chartData: BnBioNetworkGraph,
    type: 'product' | 'substrat'
  ): BnBioNetworkMetabolite[] {
    const ids = type === 'product' ? reaction.getProductIds() : reaction.getSubstratIds();

    const metabolites: BnBioNetworkMetabolite[] = [];
    for (const productId of ids) {
      const nodes = chartData.getMetaboliteAndCofactors().filter((n) => n.data.id === productId);
      if (nodes.length > 0) metabolites.push(nodes[0].data);
    }
    return metabolites;
  }

  /**
   * Select the node in the graph based on the metabolite id
   * If the metabolite is in the same cluster, select the node in the cluster
   * If the metabolite is not in the same cluster, select the first found node in the graph
   * @param metabolite
   * @param type
   */
  async selectNode(metabolite: BnBioNetworkMetabolite, type: 'product' | 'substrat'): Promise<void> {
    const reaction = await firstValueFrom(this.reaction$);

    // check if the metabolite is in the same cluster
    const connectedNodes =
      type === 'product' ? reaction.getNextMetabolites() : reaction.getPreviousMetabolites();
    const sameClusterNode = connectedNodes.find((n) => n.data.id === metabolite.id);
    if (sameClusterNode != null) {
      this.selectionState.selectNode(sameClusterNode, 'singleNode');
      return;
    }

    // select the first found node in the graph
    const chartData = await firstValueFrom(this.state.getChartData$());
    const node = chartData.getMetaboliteAndCofactors().find((n) => n.data.id === metabolite.id);
    if (node != null) {
      this.selectionState.selectNode(node, 'singleNode');
    }
  }
}
