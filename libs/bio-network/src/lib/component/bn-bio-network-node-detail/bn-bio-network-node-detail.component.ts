import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BnBioNetworkNode} from '../../model/bn-bio-network-node.class';
import {BnBioNetworkDrawerState} from '../../state/bn-bio-network-drawer.state';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'bn-bio-network-node-detail',
  templateUrl: './bn-bio-network-node-detail.component.html',
  styleUrls: ['./bn-bio-network-node-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BnBioNetworkNodeDetailComponent implements OnInit {

  node$: Observable<BnBioNetworkNode>;

  constructor(private drawerState: BnBioNetworkDrawerState) {
  }

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(
      map(state => state.selectedNode)
    );
  }

}
