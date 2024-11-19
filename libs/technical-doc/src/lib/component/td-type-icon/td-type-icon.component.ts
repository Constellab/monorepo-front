import { ChangeDetectionStrategy, Component, computed, input, Input, Signal } from '@angular/core';
import { TdTypeStyleIconType } from '../../model/td-type.class';
import { TdTechnicalDocServiceConfig } from '../../service/td-technical-doc-service-config.config';

/**
 * Component to show the icon of a type
 */
@Component({
  selector: 'td-type-icon',
  templateUrl: './td-type-icon.component.html',
  styleUrl: './td-type-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TdTypeIconComponent {
  iconTechnicalName = input.required<string>();

  iconType = input.required<TdTypeStyleIconType>();

  /**
   * Size of the icon in pixels
   */
  iconSize = input.required<number>();

  iconColor = input<string>();

  iconFull = computed(() => {
    if (this.iconType() === 'MATERIAL_ICON') return this.iconTechnicalName();
    return `${this.configService.getCommunityIconBaseApiUrl()}/${this.iconTechnicalName()}`;
  });

  sizePx = computed(() => this.iconSize() + 'px');

  constructor(private configService: TdTechnicalDocServiceConfig) {}
}
