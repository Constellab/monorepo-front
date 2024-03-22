import {Component, Input} from '@angular/core';
import {HaSpace} from '../../../../ha-model/ha-entities/ha-space.class';

@Component({
  selector: 'ha-visibility-badge',
  templateUrl: './ha-visibility-badge.component.html',
  styleUrls: ['./ha-visibility-badge.component.scss']
})
export class HaVisibilityBadgeComponent {

  @Input() space: HaSpace = null;

  constructor() {
  }

}
