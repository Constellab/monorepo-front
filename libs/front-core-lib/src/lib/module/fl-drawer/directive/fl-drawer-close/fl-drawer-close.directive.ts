import { Directive, HostListener, inject } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

/**
 * Simple directive to close the current drawer or sidenav on close
 */
@Directive({
  selector: '[flDrawerClose]',
  standalone: false,
})
export class FlDrawerCloseDirective {
  private matDrawer = inject(MatDrawer);

  @HostListener('click')
  click(): void {
    this.matDrawer.close();
  }
}
