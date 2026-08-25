import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';

import { CoBrick } from '../../model/co-brick.class';
import { CoListItemType } from '../../model/co-list-item-type.enum';

@Component({
  selector: 'co-brick-list-item',
  templateUrl: './co-brick-list-item.component.html',
  styleUrls: ['./co-brick-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class CoBrickListItemComponent {
  @Input({ required: true }) brick: CoBrick;
  @Input() brickImage: string | null | undefined;

  mainBackground = input<boolean>(false);
  hideDiscover = input<boolean>(false);

  type = CoListItemType.BRICK;
}
