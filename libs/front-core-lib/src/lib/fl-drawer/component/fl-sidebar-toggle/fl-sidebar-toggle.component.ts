import { Component, inject } from '@angular/core';

import { FlSidebarLayoutComponent } from '../fl-sidebar-layout/fl-sidebar-layout.component';

/**
 * Toggle button for the sidebar in FlSidebarLayoutComponent.
 * Must be placed inside a fl-sidebar-layout. Connects via DI.
 * Only visible when the sidebar is in overlay mode (small screens).
 */
@Component({
  selector: 'fl-sidebar-toggle',
  standalone: false,
  templateUrl: './fl-sidebar-toggle.component.html',
  styleUrls: ['./fl-sidebar-toggle.component.scss'],
})
export class FlSidebarToggleComponent {
  layout = inject(FlSidebarLayoutComponent);

  toggle(): void {
    this.layout.toggle();
  }
}
