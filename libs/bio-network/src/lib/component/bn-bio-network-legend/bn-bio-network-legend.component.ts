import { Component } from '@angular/core';

import { BN_BIO_NETWORK_COFACTOR_COLOR } from '../../model/bn-bio-network-node-cofactor.class';

/**
 * Component to show the legend of the bio network
 */
@Component({
  selector: 'bn-bio-network-legend',
  templateUrl: './bn-bio-network-legend.component.html',
  styleUrls: ['./bn-bio-network-legend.component.scss'],
  standalone: false,
})
export class BnBioNetworkLegendComponent {
  cofactorColor = BN_BIO_NETWORK_COFACTOR_COLOR;
}
