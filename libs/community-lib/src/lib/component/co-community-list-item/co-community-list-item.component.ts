import { Component, Input } from '@angular/core';
import { ClDateInput } from '@monorepo/core-lib';
import { CoSpace } from '../../model/co-space.class';
import { CoUser } from '../../model/co-user.class';

export enum CoCommunityListItemColor {
  MAIN = 'main',
  CARD = 'card',
}

@Component({
  selector: 'co-community-list-item',
  templateUrl: './co-community-list-item.component.html',
  styleUrls: ['./co-community-list-item.component.scss'],
  standalone: false,
})
export class CoCommunityListItemComponent {
  @Input({ required: true }) title: string;
  @Input() space?: CoSpace = null;
  @Input() showVisibility = false;
  @Input() description: string;
  @Input() user: CoUser;
  @Input() date: ClDateInput;
  @Input() likes: number = null;
  @Input() comments: number = null;
  @Input() executions: number = null;
}
