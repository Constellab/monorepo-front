import { Directive, HostListener, inject } from '@angular/core';
import { MatDrawerContainer } from '@angular/material/sidenav';

/**
 * Simple directive to toggle the current drawer or sidenav
 */
@Directive({
  selector: '[flDrawerToggle]',
  standalone: false,
})
export class FlDrawerToggleDirective {
  private matDrawer = inject(MatDrawerContainer);

  @HostListener('click')
  click(): void {
    this.matDrawer.start?.toggle();
  }
}
