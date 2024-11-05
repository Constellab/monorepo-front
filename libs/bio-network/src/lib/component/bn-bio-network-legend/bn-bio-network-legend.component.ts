import { Component, OnInit } from '@angular/core';
import { bnBioNetworkCofactorColor } from '../../model/bn-bio-network-node-cofactor.class';

/**
 * Component to show the legend of the bio network
 */
@Component({
  selector: 'bn-bio-network-legend',
  templateUrl: './bn-bio-network-legend.component.html',
  styleUrls: ['./bn-bio-network-legend.component.scss'],
})
export class BnBioNetworkLegendComponent implements OnInit {
  cofactorColor = bnBioNetworkCofactorColor;

  constructor() {}

  ngOnInit(): void {}
}
