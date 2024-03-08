import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TdTypeStyle} from '../../model/td-type.class';

/**
 * Component to show the icon of a type in a round circle
 */
@Component({
  selector: 'td-type-icon-badge',
  templateUrl: './td-type-icon-badge.component.html',
  styleUrl: './td-type-icon-badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TdTypeIconBadgeComponent {

  @Input({required: true}) style: TdTypeStyle;

  @Input({required: true}) iconSize: number;

  get padding(): string {
    return Math.round(this.iconSize / 4) + 'px';
  }
}
