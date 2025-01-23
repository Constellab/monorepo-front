import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Directive to support double click and single click events on an element
 * The single click event is emitted after a debounce time
 */
@Directive({
    selector: '[flDoubleClick]',
    standalone: false
})
export class FlDoubleClickDirective {
  @Output() flDoubleClick = new EventEmitter<MouseEvent>();
  @Output() flClick = new EventEmitter<MouseEvent>();

  private debounceTime: number = 250;
  private click: number = 0;

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    this.click++;

    if (this.click > 1) return;
    setTimeout(() => {
      if (this.click > 1) {
        this.flDoubleClick.emit(event);
      } else {
        this.flClick.emit(event);
      }
      this.click = 0;
    }, this.debounceTime);
  }
}
