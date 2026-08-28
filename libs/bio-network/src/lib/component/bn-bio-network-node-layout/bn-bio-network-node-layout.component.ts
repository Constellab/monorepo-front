import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { BnBioNetworkMetaboliteLevel } from '../../model/bn-bio-network.class';
import { BnBioNetworkNode } from '../../model/bn-bio-network-node.class';
import { BnBioNetworkNodeMetabolite } from '../../model/bn-bio-network-node-metabolite.class';
import { BnBioNetworkService, BnUpdateMetabolite } from '../../service/bn-bio-network.service';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';

/**
 * Component to show the position of the node with possibility to save them to biota
 * if enable
 */
@Component({
  selector: 'bn-bio-network-node-layout',
  templateUrl: './bn-bio-network-node-layout.component.html',
  styleUrls: ['./bn-bio-network-node-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class BnBioNetworkNodeLayoutComponent implements OnInit, OnDestroy {
  private bioNetworkService = inject(BnBioNetworkService, { optional: true });
  private drawerState = inject(BnBioNetworkDrawerState);
  private snackBarService = inject(FlSnackBarService);
  private cdr = inject(ChangeDetectorRef);

  node$: Observable<BnBioNetworkNode | null>;
  metabolites$: Observable<BnBioNetworkNodeMetabolite | null>;

  nodeLevel: BnBioNetworkMetaboliteLevel | undefined;

  serviceIsEnabled: boolean;

  metabolitesLevels: any = BnBioNetworkMetaboliteLevel;

  saveIsLoading: boolean = false;

  private subscription: Subscription;

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(map((state) => state.selectedNode));
    this.metabolites$ = this.node$.pipe(
      map((node) => (node instanceof BnBioNetworkNodeMetabolite ? node : null))
    );

    this.serviceIsEnabled = this.bioNetworkService?.enableSave() ?? false;

    this.subscription = this.node$.subscribe((node) => (this.nodeLevel = node?.getLevel()));
  }

  savePositions(metabolite: BnBioNetworkNodeMetabolite): void {
    const chebiId = metabolite.data.chebi_id;
    const coord = metabolite.getCoords();
    const level = this.nodeLevel;

    if (
      this.bioNetworkService &&
      !this.saveIsLoading &&
      chebiId != null &&
      coord.x != null &&
      coord.y != null &&
      level != null
    ) {
      this.saveIsLoading = true;

      const updateMetabolite: BnUpdateMetabolite = {
        chebi_id: chebiId,
        cluster_id: metabolite.cluster.clusterId,
        x: coord.x,
        y: coord.y,
        level: level,
      };

      this.bioNetworkService.saveMetaboliteLayout(updateMetabolite).subscribe({
        next: (result) => this.savePositionsSuccess(result),
        error: () => this.onError(),
      });
    }
  }

  private savePositionsSuccess(result: boolean): void {
    if (result) {
      this.snackBarService.openSuccessMessage({
        text: 'bnBioNetwork.save_metabolite_success',
        translateText: true,
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
