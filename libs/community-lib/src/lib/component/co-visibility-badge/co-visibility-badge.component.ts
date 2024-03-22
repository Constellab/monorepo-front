import {Component, Input} from '@angular/core';
import {CoSpace} from '../../model/co-space.class';


@Component({
  selector: 'co-visibility-badge',
  templateUrl: './co-visibility-badge.component.html',
  styleUrls: ['./co-visibility-badge.component.scss']
})
export class CoVisibilityBadgeComponent {

  @Input() space: CoSpace = null;

  constructor() {
  }

}
