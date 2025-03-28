import { Directive, ElementRef, HostBinding, inject, OnDestroy, OnInit } from '@angular/core';
import { Streamlit } from 'streamlit-component-lib';
import { debounceTime, Subject } from 'rxjs';

/**
 * Directive to resize streamlit iframe to its content
 */
@Directive({
  selector: '[dcResizeIframe]',
})
export class DcResizeIframeDirective implements OnInit, OnDestroy {
  private element = inject(ElementRef);

  private resizeObserver: ResizeObserver;

  @HostBinding('style.display') display = 'flex';
  @HostBinding('style.flex-direction') flexDirection = 'column';

  private heightChange$ = new Subject<number>();

  private RESIZE_DEBOUNCE_TIME = 300;

  ngOnInit(): void {
    this.heightChange$
      .pipe(debounceTime(this.RESIZE_DEBOUNCE_TIME))
      .subscribe((height) => Streamlit.setFrameHeight(height));

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === this.element.nativeElement) {
          this.heightChange$.next(entry.contentRect.height);
        }
      }
    });

    this.resizeObserver.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver.disconnect();
    this.heightChange$.complete();
  }
}
