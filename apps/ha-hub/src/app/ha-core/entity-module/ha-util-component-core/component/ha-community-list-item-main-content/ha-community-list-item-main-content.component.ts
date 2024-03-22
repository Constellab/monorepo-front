import {Component, Input} from '@angular/core';
import {HaUser} from '../../../../ha-model/ha-entities/ha-user';
import {ClDateInput} from '@monorepo/core-lib';

@Component({
  selector: 'ha-community-list-item-main-content',
  templateUrl: './ha-community-list-item-main-content.component.html',
  styleUrls: ['./ha-community-list-item-main-content.component.scss']
})
export class HaCommunityListItemMainContentComponent {

  @Input({required: true}) title: string;
  @Input() description: string;
  @Input() user: HaUser;
  @Input() date: ClDateInput;
  @Input() likes: number = null;

  constructor() {
  }

}
