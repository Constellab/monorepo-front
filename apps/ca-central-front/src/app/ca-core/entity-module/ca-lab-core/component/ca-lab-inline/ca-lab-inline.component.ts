import { Component, Input } from '@angular/core';
import { CaLab } from '../../../../model/entities/lab/ca-lab.class';

@Component({
    selector: 'ca-lab-inline',
    templateUrl: './ca-lab-inline.component.html',
    styleUrls: ['./ca-lab-inline.component.scss'],
    standalone: false
})
export class CaLabInlineComponent {
  @Input() lab: CaLab;
}
