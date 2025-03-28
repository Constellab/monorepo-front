import { Component, Input } from '@angular/core';
import { DateTime } from 'luxon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiResourceViewType, LiUser } from '@monorepo/lab-lib/li-core';
import { MatRipple } from '@angular/material/core';
import { TdTechnicalDocModule, TdTypeStyle } from '@monorepo/technical-doc';

@Component({
  selector: 'li-resource-view-spec-card',
  templateUrl: './li-resource-view-spec-card.component.html',
  styleUrls: ['./li-resource-view-spec-card.component.scss'],
  imports: [MatRipple, TdTechnicalDocModule, FlUserModule],
})
export class LiResourceViewSpecCardComponent {
  @Input({ required: true }) viewType: LiResourceViewType;

  @Input({ required: true }) name: string;

  @Input({ required: true }) style: TdTypeStyle;

  @Input() user: LiUser;

  @Input() creationDate: DateTime;

  @Input() shortDescription: string;
}
