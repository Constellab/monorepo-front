import { Component, Input } from '@angular/core';
import { LabResourceViewType } from '../../../../model/entities/resource/lab-resource-view.entity';
import { LabUser } from '../../../../model/entities/lab-user.entity';
import { DateTime } from 'luxon';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { MatRipple } from '@angular/material/core';
import { TdTechnicalDocModule } from '@monorepo/technical-doc';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

@Component({
  selector: 'lab-resource-view-spec-card',
  templateUrl: './lab-resource-view-spec-card.component.html',
  styleUrls: ['./lab-resource-view-spec-card.component.scss'],
  imports: [MatRipple, TdTechnicalDocModule, FlUserModule],
})
export class LabResourceViewSpecCardComponent {
  @Input({ required: true }) viewType: LabResourceViewType;

  @Input({ required: true }) name: string;

  @Input({ required: true }) style: TdTypeStyle;

  @Input() user: LabUser;

  @Input() creationDate: DateTime;

  @Input() shortDescription: string;
}
