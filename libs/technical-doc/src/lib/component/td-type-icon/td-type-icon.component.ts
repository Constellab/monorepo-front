import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TdTypeStyleIconType} from '../../model/td-type.class';
import {TdServiceConfig} from '../../service/td-service-config.config';

/**
 * Component to show the icon of a type
 */
@Component({
  selector: 'td-type-icon',
  templateUrl: './td-type-icon.component.html',
  styleUrl: './td-type-icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdTypeIconComponent {

  @Input({required: true}) iconTechnicalName: string;

  @Input({required: true}) iconType: TdTypeStyleIconType;

  /**
   * Size of the icon in pixels
   */
  @Input({required: true}) iconSize: number;

  @Input() iconColor: string;

  constructor(private configService: TdServiceConfig) {
  }


  get iconFull(): string {
    if (this.iconType === 'MATERIAL_ICON') return this.iconTechnicalName;
    return `${this.configService.getCommunityIconBaseApiUrl()}/${this.iconTechnicalName}`;
  }

  get sizePx(): string {
    return this.iconSize + 'px';
  }
}
