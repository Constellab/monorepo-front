import {ChangeDetectorRef, Component, OnDestroy, OnInit, Optional} from '@angular/core';
import {BnBioNetworkService, BnUpdateMetabolite} from '../../service/bn-bio-network.service';
import {BnBioNetworkNode} from '../../model/bn-bio-network-node.class';
import {BnBioNetworkMetaboliteLevel} from '../../model/bn-bio-network.class';
import {Observable, Subscription} from 'rxjs';
import {map} from 'rxjs/operators';
import {BnBioNetworkDrawerState} from '../../state/bn-bio-network-drawer.state';
import {BnBioNetworkNodeMetabolite} from '../../model/bn-bio-network-node-metabolite.class';
import {FlSnackBarService} from '@monorepo/front-core-lib';

/**
 * Component to show the position of the node with possibility to save them to biota
 * if enable
 */
@Component({
  selector: 'bn-bio-network-node-layout',
  templateUrl: './bn-bio-network-node-layout.component.html',
  styleUrls: ['./bn-bio-network-node-layout.component.scss']
})
export class BnBioNetworkNodeLayoutComponent implements OnInit, OnDestroy {

  node$: Observable<BnBioNetworkNode>;
  metabolites$: Observable<BnBioNetworkNodeMetabolite>;

  nodeLevel: BnBioNetworkMetaboliteLevel;

  serviceIsEnabled: boolean;

  metabolitesLevels: any = BnBioNetworkMetaboliteLevel;

  saveIsLoading: boolean = false;

  private subscription: Subscription;

  constructor(@Optional() private bioNetworkService: BnBioNetworkService,
              private drawerState: BnBioNetworkDrawerState,
              private snackBarService: FlSnackBarService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(
      map(state => state.selectedNode)
    );
    this.metabolites$ = this.node$.pipe(
      map(node => node instanceof BnBioNetworkNodeMetabolite ? node : null)
    );

    this.serviceIsEnabled = this.bioNetworkService?.enableSave() ?? false;

    this.subscription = this.node$.subscribe(node => this.nodeLevel = node.getLevel());
  }

  savePositions(metabolite: BnBioNetworkNodeMetabolite): void {
    if (this.bioNetworkService && !this.saveIsLoading) {
      this.saveIsLoading = true;

      const updateMetabolite: BnUpdateMetabolite = {
        chebi_id: metabolite.data.chebi_id,
        cluster_id: metabolite.cluster.clusterId,
        x: metabolite.x,
        y: metabolite.y,
        level: this.nodeLevel
      };

      this.bioNetworkService.saveMetaboliteLayout(updateMetabolite).subscribe({
        next: result => this.savePositionsSuccess(result),
        error: () => this.onError()
      });
    }
  }

  private savePositionsSuccess(result: boolean): void {
    if (result) {
      this.snackBarService.openSuccessMessage({
        text: 'bnBioNetwork.save_metabolite_success',
        translateText: true
      });
    }
    this.saveIsLoading = false;
    this.cdr.markForCheck();
  }

  private onError(): void {
    this.saveIsLoading = false;
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
