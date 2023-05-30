import {Component, Input} from '@angular/core';
import {LabTypeEntity} from '../../../../model/entities/lab-type/lab-type.entity';

@Component({
  selector: 'lab-type-inline',
  templateUrl: './lab-type-inline.component.html',
  styleUrls: ['./lab-type-inline.component.scss'],
})
export class LabTypeInlineComponent {

  @Input() type: LabTypeEntity;

}
