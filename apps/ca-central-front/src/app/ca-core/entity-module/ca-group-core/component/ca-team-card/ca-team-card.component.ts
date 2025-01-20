import { Component, Input, OnInit } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';

@Component({
    selector: 'ca-team-card',
    templateUrl: './ca-team-card.component.html',
    styleUrls: ['./ca-team-card.component.scss'],
    standalone: false
})
export class CaTeamCardComponent implements OnInit {
  @Input() team: CaGroup;

  constructor() {}

  ngOnInit(): void {}
}
