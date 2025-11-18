import { Component, Input } from '@angular/core';

import { CoBrick } from '../../model/co-brick.class';
import { CoListItemType } from '../../model/co-list-item-type.enum';

@Component({
  selector: 'co-brick-list-item',
  templateUrl: './co-brick-list-item.component.html',
  styleUrls: ['./co-brick-list-item.component.scss'],
  standalone: false,
})
export class CoBrickListItemComponent {
  @Input({ required: true }) brick: CoBrick;
  @Input() brickImage: string;

  type = CoListItemType.BRICK;
}
