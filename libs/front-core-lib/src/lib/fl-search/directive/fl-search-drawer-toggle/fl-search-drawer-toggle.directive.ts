import { Directive, HostListener, inject } from '@angular/core';

import { FlSearchState } from '../../model/fl-search.state';

/**
 * Simple directive to toggle the drawer from the search component
 */
@Directive({
  selector: '[flSearchDrawerToggle]',
  standalone: false,
})
export class FlSearchDrawerToggleDirective {
  private searchState = inject<FlSearchState<any>>(FlSearchState);

  @HostListener('click')
  onClick(): void {
    this.searchState.toggleDrawer();
  }
}
