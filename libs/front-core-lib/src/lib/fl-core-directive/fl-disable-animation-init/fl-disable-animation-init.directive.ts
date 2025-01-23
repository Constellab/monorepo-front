import { AfterViewInit, Directive, HostBinding } from '@angular/core';

/**
 * Simple directive that disable animation on init until the viewAfterInit
 *
 * Useful for mat-expansion in dialog for example
 */
@Directive({
  selector: '[flDisableAnimationInit]',
  standalone: false,
})
export class FlDisableAnimationInitDirective implements AfterViewInit {
  @HostBinding('@.disabled') private disabled = true;

  ngAfterViewInit(): void {
    setTimeout(() => (this.disabled = false), 0);
  }
}
