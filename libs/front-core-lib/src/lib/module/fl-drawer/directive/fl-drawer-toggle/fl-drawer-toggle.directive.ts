import {Directive, HostListener} from '@angular/core';
import {MatDrawerContainer} from '@angular/material/sidenav';

/**
 * Simple directive to toggle the current drawer or sidenav
 */
@Directive({
  selector: '[flDrawerToggle]',
})
export class FlDrawerToggleDirective {
  constructor(private matDrawer: MatDrawerContainer) {
  }

  @HostListener('click')
  click(): void {
    this.matDrawer.start.toggle();
  }
}
