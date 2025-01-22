import { Component, Input, OnInit } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { MatRipple } from '@angular/material/core';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';

@Component({
  selector: 'ca-team-card',
  templateUrl: './ca-team-card.component.html',
  styleUrls: ['./ca-team-card.component.scss'],
  imports: [FlCardModule, MatRipple, FlTextIconModule, MatIcon, FlIconModule, FlUserModule],
})
export class CaTeamCardComponent implements OnInit {
  @Input() team: CaGroup;

  constructor() {}

  ngOnInit(): void {}
}
