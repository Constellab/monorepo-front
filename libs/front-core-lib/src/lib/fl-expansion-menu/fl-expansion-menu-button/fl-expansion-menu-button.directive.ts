import { Directive, ElementRef, OnInit, Renderer2, inject } from '@angular/core';
import { FlExpansionMenuComponent } from '../fl-expansion-menu/fl-expansion-menu.component';
import { MatTooltip } from '@angular/material/tooltip';

/**
 * Directive that must be place on a mat-button to work correctly. It adds classes and logic for button
 * inside an expansion menu to fit menu size
 */
@Directive({
  selector: '[flExpansionMenuButton]',
  standalone: false,
})
export class FlExpansionMenuButtonDirective implements OnInit {
  private flExpansionMenuComponent = inject(FlExpansionMenuComponent);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);
  private tooltip = inject(MatTooltip, { self: true, optional: true });

  private readonly buttonClass = 'expansion-menu-button';

  ngOnInit(): void {
    this.renderer.addClass(this.elementRef.nativeElement, this.buttonClass);
    this.onExpansionChanged(this.flExpansionMenuComponent.expanded);
    this.flExpansionMenuComponent.expandedChange.subscribe((expanded) => this.onExpansionChanged(expanded));
  }

  private onExpansionChanged(expanded: boolean): void {
    if (expanded) {
      this.renderer.addClass(this.elementRef.nativeElement, this.buttonClass + '-large');
      this.renderer.removeClass(this.elementRef.nativeElement, this.buttonClass + '-small');

      // if there is a tooltip in the button, disable it because the button is full
      if (this.tooltip) {
        this.tooltip.disabled = true;
      }
    } else {
      this.renderer.addClass(this.elementRef.nativeElement, this.buttonClass + '-small');
      this.renderer.removeClass(this.elementRef.nativeElement, this.buttonClass + '-large');

      // if there is a tooltip in the button, enable it because the button small
      if (this.tooltip) {
        this.tooltip.disabled = false;
      }
    }
  }
}
