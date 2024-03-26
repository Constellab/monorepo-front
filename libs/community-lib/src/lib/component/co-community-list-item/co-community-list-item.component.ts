import {Component, Input} from '@angular/core';
import {ClDateInput} from '@monorepo/core-lib';
import {FlUser} from '@monorepo/front-core-lib';

export enum CoCommunityListItemColor {
  MAIN = 'main',
  CARD = 'card',
}

@Component({
  selector: 'co-community-list-item',
  templateUrl: './co-community-list-item.component.html',
  styleUrls: ['./co-community-list-item.component.scss']
})
export class CoCommunityListItemComponent {

  @Input({required: true}) title: string;
  @Input() description: string;
  @Input() user: FlUser;
  @Input() date: ClDateInput;
  @Input() likes: number = null;
  @Input() comments: number = null;
  @Input() backgroundColor: CoCommunityListItemColor | string = CoCommunityListItemColor.CARD;

  constructor() {
  }
}
