import { Component, Input, OnInit } from '@angular/core';
import { BnBioNetworkReaction } from '../../model/bn-bio-network.class';

@Component({
  selector: 'bn-bio-network-reaction-detail',
  templateUrl: './bn-bio-network-reaction-detail.component.html',
  styleUrls: ['./bn-bio-network-reaction-detail.component.scss'],
})
export class BnBioNetworkReactionDetailComponent implements OnInit {
  @Input() reaction: BnBioNetworkReaction;

  constructor() {}

  ngOnInit(): void {}
}
