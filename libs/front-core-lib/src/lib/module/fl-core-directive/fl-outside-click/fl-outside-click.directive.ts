import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  inject,
} from '@angular/core';

/**
 * Directive that emit an event when a mouse click occurred outside the host element
 */
@Directive({
  selector: '[flOutsideClick]',
  standalone: false,
})
export class FlOutsideClickDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  @Output() flOutsideClick: EventEmitter<MouseEvent> = new EventEmitter();

  private listener: () => void;

  ngOnInit(): void {
    this.listener = this.renderer.listen('body', 'click', (event: MouseEvent) => this.checkElement(event));
  }

  // check if the event occurred inside the host element
  private checkElement(event: MouseEvent): void {
    const host: HTMLElement = this.elementRef.nativeElement;

    let element: HTMLElement = event.target as HTMLElement;

    while (element != null) {
      if (element === host) {
        return;
      }

      element = element.parentElement;
    }

    // if we reach this code, it mean the click append outside
    this.flOutsideClick.emit(event);
  }

  ngOnDestroy(): void {
    if (this.listener) this.listener();
  }
}
