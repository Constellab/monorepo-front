import {Component, Input} from '@angular/core';
import {LabResourceViewType} from '../../../../model/entities/resource/lab-resource-view.entity';
import {LabUser} from '../../../../model/entities/lab-user.entity';
import {DateTime} from 'luxon';

@Component({
  selector: 'lab-resource-view-spec-card',
  templateUrl: './lab-resource-view-spec-card.component.html',
  styleUrls: ['./lab-resource-view-spec-card.component.scss'],
})
export class LabResourceViewSpecCardComponent {

  @Input() viewType: LabResourceViewType;

  @Input() name: string;

  @Input() shortDescription: string;

  @Input() user: LabUser;

  @Input() creationDate: DateTime;
}
