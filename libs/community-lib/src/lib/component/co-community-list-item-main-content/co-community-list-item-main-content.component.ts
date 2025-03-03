import { Component, Input } from '@angular/core';
import { ClDateInput } from '@monorepo/core-lib';
import { CoSpace } from '../../model/co-space.class';
import { CoUser } from '../../model/co-user.class';

@Component({
  selector: 'co-community-list-item-main-content',
  templateUrl: './co-community-list-item-main-content.component.html',
  styleUrls: ['./co-community-list-item-main-content.component.scss'],
  standalone: false,
})
export class CoCommunityListItemMainContentComponent {
  @Input({ required: true }) title: string;
  @Input() showVisibility: boolean;
  @Input() space?: CoSpace;
  @Input() description: string;
  @Input() user: CoUser;
  @Input() date: ClDateInput;
  @Input() likes: number = null;
  @Input() comments: number = null;
  @Input() executions: number = null;
}
