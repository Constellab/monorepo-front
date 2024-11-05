import { Directive } from '@angular/core';
import { RouterLinkActive } from '@angular/router';

/**
 * Directive to hide link if the link is the same as the current page
 */
@Directive({
  selector: '[flHideSamePageLink]',
  hostDirectives: [
    {
      directive: RouterLinkActive,
      inputs: ['routerLinkActiveOptions'],
    },
  ],
})
export class FlHideSamePageLinkDirective {
  constructor(private routerLinkActive: RouterLinkActive) {
    this.routerLinkActive.routerLinkActive = 'g-fl-hide-same-page-link';
  }
}
