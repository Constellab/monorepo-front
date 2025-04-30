import { Component, Input } from '@angular/core';
import { CaGroup } from '../../../../model/entities/ca-group.entity';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { MatRipple } from '@angular/material/core';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

@Component({
  selector: 'ca-team-card',
  templateUrl: './ca-team-card.component.html',
  styleUrls: ['./ca-team-card.component.scss'],
  imports: [FlCardModule, MatRipple, FlTextIconModule, MatIcon, FlIconModule, FlUserModule],
})
export class CaTeamCardComponent {
  @Input() team: CaGroup;
}
