import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map} from 'rxjs/operators';
import {BnBioNetworkNodeCofactor} from '../../model/bn-bio-network-node-cofactor.class';
import {BnBioNetworkDrawerState} from '../../state/bn-bio-network-drawer.state';

/**
 * Detail information about one cofactor node
 */
@Component({
  selector: 'bn-bio-network-node-cofactor-detail',
  templateUrl: './bn-bio-network-node-cofactor-detail.component.html',
  styleUrls: ['./bn-bio-network-node-cofactor-detail.component.scss']
})
export class BnBioNetworkNodeCofactorDetailComponent implements OnInit {

  node$: Observable<BnBioNetworkNodeCofactor>;

  constructor(private drawerState: BnBioNetworkDrawerState) {
  }

  ngOnInit(): void {
    this.node$ = this.drawerState.getState$().pipe(
      filter(state => state.selectedNode instanceof BnBioNetworkNodeCofactor),
      map(state => state.selectedNode as BnBioNetworkNodeCofactor)
    );
  }

}
