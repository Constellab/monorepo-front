import { Component, input } from '@angular/core';

export type FlInfoBannerVariant = 'primary' | 'accent' | 'error' | 'neutral';

/**
 * A full-width rounded banner (leading icon + title + body + projected trailing action).
 * Used for "restart needed", "error" and "update available" style notices. The trailing
 * action button is projected via <ng-content>.
 */
@Component({
  selector: 'fl-info-banner',
  templateUrl: './fl-info-banner.component.html',
  styleUrls: ['./fl-info-banner.component.scss'],
  standalone: false,
})
export class FlInfoBannerComponent {
  icon = input.required<string>();
  title = input.required<string>();
  body = input<string>('');
  /** Colour scheme of the banner container. */
  variant = input<FlInfoBannerVariant>('neutral');
}
