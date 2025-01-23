import { Directive, HostListener, Input, inject } from '@angular/core';
import { FlOverlayRef } from '../model/fl-overlay-ref.class';

@Directive({
  selector: '[flPortalClose]',
  standalone: false,
})
export class FlPortalCloseDirective {
  private overlayRef = inject(FlOverlayRef);

  /**
   * Data to send when closing portal using this button
   */
  @Input() flPortalClose: any = null;

  @HostListener('click')
  click(): void {
    // when value is '' consider it as null
    this.overlayRef.dispose(this.flPortalClose === '' ? null : this.flPortalClose);
  }
}
