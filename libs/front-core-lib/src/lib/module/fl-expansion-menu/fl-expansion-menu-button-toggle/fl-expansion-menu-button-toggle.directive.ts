import { Directive, HostListener, inject } from '@angular/core';
import { FlExpansionMenuComponent } from '../fl-expansion-menu/fl-expansion-menu.component';

/**
 * Directive to place on an element inside a {@link FlExpansionMenuComponent}
 * to toggle menu on click
 */
@Directive({
  selector: '[flExpansionMenuButtonToggle]',
  standalone: false,
})
export class FlExpansionMenuButtonToggleDirective {
  private expansionMenuComponent = inject(FlExpansionMenuComponent);

  @HostListener('click')
  click(): void {
    this.expansionMenuComponent.toggleMenu();
  }
}
