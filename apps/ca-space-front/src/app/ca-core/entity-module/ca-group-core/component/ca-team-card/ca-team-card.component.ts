import { Component, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { CaGroup } from '../../../../model/entities/ca-group.entity';

@Component({
  selector: 'ca-team-card',
  templateUrl: './ca-team-card.component.html',
  styleUrls: ['./ca-team-card.component.scss'],
  imports: [FlCardModule, MatRipple, FlTextIconModule, MatIcon, FlIconModule, FlUserModule],
})
export class CaTeamCardComponent {
  @Input() team: CaGroup;
}
