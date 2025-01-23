import { Component, Input } from '@angular/core';
import { BnBioNetworkReaction } from '../../model/bn-bio-network.class';

@Component({
  selector: 'bn-bio-network-reaction-detail',
  templateUrl: './bn-bio-network-reaction-detail.component.html',
  styleUrls: ['./bn-bio-network-reaction-detail.component.scss'],
  standalone: false,
})
export class BnBioNetworkReactionDetailComponent {
  @Input() reaction: BnBioNetworkReaction;
}
