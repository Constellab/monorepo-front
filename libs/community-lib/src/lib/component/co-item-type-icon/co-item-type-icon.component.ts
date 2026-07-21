import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy,Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';

import { CoListItemType } from '../../model/co-list-item-type.enum';

@Component({
  selector: 'co-item-type-icon',
  templateUrl: './co-item-type-icon.component.html',
  styleUrls: ['./co-item-type-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlIconModule, MatIconModule, NgClass],
})
export class CoItemTypeIconComponent {
  type = input.required<CoListItemType>();

  size = input<'small' | 'medium' | 'big'>('medium');

  color = computed(() => {
    switch (this.type()?.toLowerCase()) {
      case CoListItemType.APP:
        return 'accent';
      case CoListItemType.BRICK:
        return 'warn';
      case CoListItemType.AGENT:
        return 'primary';
      case CoListItemType.STORY:
        return 'warn';
      case CoListItemType.TAG:
        return 'accent';
      case CoListItemType.PARTNER:
        return 'primary';
      default:
        return 'primary';
    }
  });

  colorClass = computed(() => {
    switch (this.color()) {
      case 'primary':
        return 'co-type-icon-primary';
      case 'accent':
        return 'co-type-icon-accent';
      case 'warn':
        return 'co-type-icon-warn';
      default:
        return '';
    }
  });

  sizeClass = computed(() => {
    switch (this.size()) {
      case 'small':
        return 'co-type-icon-small';
      case 'medium':
        return 'co-type-icon-medium';
      case 'big':
        return 'co-type-icon-big';
      default:
        return '';
    }
  });

  isPartnerType = computed(() => this.type() === CoListItemType.PARTNER);
}
