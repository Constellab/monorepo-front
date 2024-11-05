import { Component, OnInit } from '@angular/core';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';
import { RvResourceViewNetwork } from '../../model/rv-resource-view.class';
import { BnBioNetwork } from '@monorepo/bio-network';

/**
 * Display the resource as a network pathway
 */
@Component({
  selector: 'rv-view-network',
  templateUrl: './rv-view-network.component.html',
  styleUrls: ['./rv-view-network.component.scss'],
})
export class RvViewNetworkComponent extends RvResourceViewDirective<RvResourceViewNetwork> implements OnInit {
  networks: BnBioNetwork | BnBioNetwork[];

  error: boolean;

  ngOnInit(): void {
    this.networks = this.view.data;
    this.error = false;
  }
}
