import {Component, Input, OnInit} from '@angular/core';
import {BnBioNetworkMetabolite} from '../../model/bn-bio-network.class';

/**
 * Detail information for a Metabolite object
 */
@Component({
  selector: 'bn-bio-network-metabolite-detail',
  templateUrl: './bn-bio-network-metabolite-detail.component.html',
  styleUrls: ['./bn-bio-network-metabolite-detail.component.scss'],
})
export class BnBioNetworkMetaboliteDetailComponent implements OnInit {

  @Input() metabolite: BnBioNetworkMetabolite;

  constructor() {
  }

  ngOnInit(): void {
  }
}
