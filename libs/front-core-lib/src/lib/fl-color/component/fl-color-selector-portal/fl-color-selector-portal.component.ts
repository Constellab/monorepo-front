import { Component, inject } from '@angular/core';
import { FL_PORTAL_DATA, FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';

@Component({
  selector: 'fl-color-selector-portal',
  templateUrl: './fl-color-selector-portal.component.html',
  styleUrls: ['./fl-color-selector-portal.component.scss'],
  standalone: false,
})
export class FlColorSelectorPortalComponent {
  private overlayRef = inject(FlOverlayRef);

  color?: string = inject(FL_PORTAL_DATA);

  onColorSelected(color: string): void {
    this.overlayRef.dispose(color);
  }
}
