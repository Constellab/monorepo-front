import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { TdTypeStyleIconColor, TdTypeStyleIconType } from '../../model/td-type.class';
import { TdTechnicalDocServiceConfig } from '../../service/td-technical-doc-service-config.config';

/**
 * Component to show the icon of a type
 */
@Component({
  selector: 'td-type-icon',
  templateUrl: './td-type-icon.component.html',
  styleUrl: './td-type-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class TdTypeIconComponent {
  iconTechnicalName = input.required<string>();

  iconType = input.required<TdTypeStyleIconType>();

  /**
   * Size of the icon in pixels
   */
  iconSize = input.required<number>();

  iconColor = input<TdTypeStyleIconColor>();

  iconFull = computed(() => {
    if (this.iconType() === 'MATERIAL_ICON') return this.iconTechnicalName();
    return `${this.configService.getCommunityIconBaseApiUrl()}/${this.iconTechnicalName()}`;
  });

  sizePx = computed(() => this.iconSize() + 'px');

  private configService = inject(TdTechnicalDocServiceConfig);
}
