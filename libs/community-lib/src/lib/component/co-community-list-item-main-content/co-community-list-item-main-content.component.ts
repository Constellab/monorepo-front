import {Component, Input} from '@angular/core';
import {ClDateInput} from '@monorepo/core-lib';
import {FlUser} from '@monorepo/front-core-lib';
import {CoSpace} from '../../model/co-space.class';

@Component({
  selector: 'co-community-list-item-main-content',
  templateUrl: './co-community-list-item-main-content.component.html',
  styleUrls: ['./co-community-list-item-main-content.component.scss']
})
export class CoCommunityListItemMainContentComponent {

  @Input({required: true}) title: string;
  @Input() showVisibility: boolean;
  @Input() space?: CoSpace;
  @Input() description: string;
  @Input() user: FlUser;
  @Input() date: ClDateInput;
  @Input() likes: number = null;
  @Input() comments: number = null;

  constructor() {
  }

}
