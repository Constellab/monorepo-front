import {Component, Input} from '@angular/core';
import {CaLabInstance} from '../../../../model/entities/lab/ca-lab-instance.class';

@Component({
  selector: 'ca-lab-inline',
  templateUrl: './ca-lab-inline.component.html',
  styleUrls: ['./ca-lab-inline.component.scss'],
})
export class CaLabInlineComponent {

  @Input() lab: CaLabInstance;
}
