import { ChangeDetectionStrategy,Component, OnInit } from '@angular/core';
import { BnBioNetwork } from '@monorepo/bio-network';

import { RvResourceViewNetwork } from '../../model/rv-resource-view.class';
import { RvResourceViewDirective } from '../../model/rv-resource-view.directive';

/**
 * Display the resource as a network pathway
 */
@Component({
  selector: 'rv-view-network',
  templateUrl: './rv-view-network.component.html',
  styleUrls: ['./rv-view-network.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RvViewNetworkComponent extends RvResourceViewDirective<RvResourceViewNetwork> implements OnInit {
  networks: BnBioNetwork | BnBioNetwork[];

  error: boolean;

  ngOnInit(): void {
    this.networks = this.view.data;
    this.error = false;
  }
}
