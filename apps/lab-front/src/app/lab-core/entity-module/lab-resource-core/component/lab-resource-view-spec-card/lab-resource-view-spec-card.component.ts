import {Component, Input} from '@angular/core';
import {LabResourceViewSpec} from '../../../../model/entities/resource/lab-resource-view.entity';

@Component({
  selector: 'lab-resource-view-spec-card',
  templateUrl: './lab-resource-view-spec-card.component.html',
  styleUrls: ['./lab-resource-view-spec-card.component.scss'],
})
export class LabResourceViewSpecCardComponent {

  @Input() viewSpec: LabResourceViewSpec;
}
