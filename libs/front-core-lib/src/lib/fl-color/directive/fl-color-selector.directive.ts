import { Directive, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { ClHelpService } from '@monorepo/core-lib';
import { FlColorSelectorPortalComponent } from '../component/fl-color-selector-portal/fl-color-selector-portal.component';
import { FlPortalConnectedPosition, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

/**
 * directive to place on any element to open the select color portal on click
 *
 * Support double binding with [(flColorSelector)]
 */
@Directive({
  selector: '[flColorSelector]',
  standalone: false,
})
export class FlColorSelectorDirective {
  private portalService = inject(FlPortalService);

  @Input() flColorSelector: string;

  @Output() flColorSelectorChange: EventEmitter<string> = new EventEmitter<string>();

  @Input() flColorSelectorPositions: FlPortalConnectedPosition[] = ['bottom', 'left', 'top', 'right'];

  @HostListener('click', ['$event']) onMouseEnter(event: MouseEvent): void {
    this.openPortal(event);
  }

  private openPortal(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const config = this.portalService.configureRelativePortalFromMouseEvent(
      event,
      this.flColorSelectorPositions,
      {
        disposeOnOutsideClick: true,
        disposeOnNavigation: true,
      }
    );

    this.portalService
      .createPortal(FlColorSelectorPortalComponent, config, this.flColorSelector)
      .detachments()
      .subscribe((color) => this.onColorSelectorClose(color));
  }

  private onColorSelectorClose(color?: string): void {
    if (color) {
      this.flColorSelectorChange.next(color);
    }
  }
}
