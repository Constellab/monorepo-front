import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { TD_TYPE_STYLE_DEFAULT, TdTypeStyle } from '../../model/td-type.class';

/**
 * Component to show the icon of a type in a round circle
 */
@Component({
  selector: 'td-type-icon-badge',
  templateUrl: './td-type-icon-badge.component.html',
  styleUrl: './td-type-icon-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TdTypeIconBadgeComponent {
  // Genuinely optional: callers may not have a style yet (eg. technicalDoc?.style).
  style = input.required<TdTypeStyle | undefined>();
  iconSize = input.required<number>();
  padding = computed(() => Math.round(this.iconSize() / 4) + 'px');
  styleWithDefault = computed(() => this.style() ?? TD_TYPE_STYLE_DEFAULT);
}
