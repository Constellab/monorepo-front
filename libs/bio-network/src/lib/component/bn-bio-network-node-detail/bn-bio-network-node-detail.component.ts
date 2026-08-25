import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BnBioNetworkNode } from '../../model/bn-bio-network-node.class';
import { BnBioNetworkDrawerState } from '../../state/bn-bio-network-drawer.state';

@Component({
  selector: 'bn-bio-network-node-detail',
  templateUrl: './bn-bio-network-node-detail.component.html',
  styleUrls: ['./bn-bio-network-node-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class BnBioNetworkNodeDetailComponent implements OnInit {
  private drawerState = inject(BnBioNetworkDrawerState);

  node$: Observable<BnBioNetworkNode | null>;

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(map((state) => state.selectedNode));
  }
}
