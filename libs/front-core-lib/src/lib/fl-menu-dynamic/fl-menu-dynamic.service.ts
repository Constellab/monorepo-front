import { ElementRef, inject, Injectable } from '@angular/core';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalConfig } from '@monorepo/front-core-lib/fl-portal';

import { FlOverlayConfig, FlPortalConnectedPosition } from '../fl-portal/model/fl-portal.class';
import { FlMenuDynamicPortalComponent } from './component/fl-menu-dynamic-portal/fl-menu-dynamic-portal.component';
import { FlMenuDynamicInput } from './model/fl-menu-dynamic.class';

@Injectable({
  providedIn: 'root',
})
export class FlMenuDynamicService {
  private portalService = inject(FlPortalService);

  private readonly overlayConfig: FlOverlayConfig = {
    disposeOnNavigation: true,
  };

  private readonly positions: FlPortalConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    'right',
    'top',
    'left',
    'bottom',
  ];

  /**
   * Open the menu portal relative to the element
   */
  public openDynamicMenuRelative(
    menu: FlMenuDynamicInput,
    element: Element | ElementRef,
    position: FlPortalConnectedPosition[] = this.positions
  ): FlOverlayRef {
    const config: FlPortalConfig = this.portalService.configureRelativePortal(
      element,
      position,
      this.overlayConfig
    );

    return this.createPortal(menu, config);
  }

  /**
   * Open the menu portal relative to the element on mouse position
   */
  public openDynamicMenuFromMouseEvent(
    menu: FlMenuDynamicInput,
    mouseEvent: MouseEvent,
    position: FlPortalConnectedPosition[] = this.positions
  ): FlOverlayRef {
    const config: FlPortalConfig = this.portalService.configureRelativePortalFromMouseEvent(
      mouseEvent,
      position,
      this.overlayConfig
    );

    return this.createPortal(menu, config);
  }

  /**
   * Open the menu on absolute position. BE CAREFUL,
   * it can appear outside the screen. To use when openDynamicMenuFromMouseEvent
   * does not work correct
   */
  public openDynamicMenuAbsolute(menu: FlMenuDynamicInput, event: MouseEvent): FlOverlayRef {
    const config: FlPortalConfig = this.portalService.configureAbsolutePortalFromMouseEvent(event);

    return this.createPortal(menu, config);
  }

  private createPortal(menu: FlMenuDynamicInput, config: FlPortalConfig): FlOverlayRef {
    return this.portalService.createPortal(FlMenuDynamicPortalComponent, config, menu);
  }
}
