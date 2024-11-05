import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Component to display and icon along with a text.
 *
 * The icon should be wrap in a mat-icon tag.
 *
 * The text can be any tag.
 */
@Component({
  selector: 'fl-text-icon',
  templateUrl: './fl-text-icon.component.html',
  styleUrls: ['./fl-text-icon.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlTextIconComponent {
  /**
   * The gap between the icon and the text
   */
  @Input() gap = '10px';

  /**
   * The position of the icon. Start --> the icon before the text. End --> the icon is after the text
   */
  @Input() iconPosition: 'start' | 'end' = 'start';

  /**
   * If false the icon is not shown
   */
  @Input() showIcon: boolean = true;

  get leftMargin(): string {
    return this.iconPosition === 'start' ? this.gap : '0';
  }

  get rightMargin(): string {
    return this.iconPosition === 'end' ? this.gap : '0';
  }
}
