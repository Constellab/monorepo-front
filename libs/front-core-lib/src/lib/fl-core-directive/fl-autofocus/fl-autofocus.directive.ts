import { AfterViewInit, Directive, ElementRef, inject, Input } from '@angular/core';

/**
 * Simple directive to force the focus of the container when it appears on screen
 */
@Directive({
  selector: '[flAutofocus]',
  standalone: false,
})
export class FlAutofocusDirective implements AfterViewInit {
  private elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  /**
   * Delay in ms before the focus is executed
   */
  @Input() flAutofocus: number = 0;

  ngAfterViewInit(): void {
    setTimeout(() => this.elementRef.nativeElement?.focus(), this.flAutofocus);
  }
}
