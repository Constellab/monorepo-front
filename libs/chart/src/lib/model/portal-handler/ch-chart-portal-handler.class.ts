import { ComponentType, ConnectedPosition } from '@angular/cdk/overlay';
import { NgZone } from '@angular/core';
import {
  ChChartDataWithSeriePortalComponent,
  ChChartDataWithSeriePortalInput,
} from '../../component/ch-chart-data-portal/ch-chart-data-with-serie-portal/ch-chart-data-with-serie-portal.component';
import {
  FlOverlayRef,
  FlPortalConfig,
  FlPortalService,
  FlRelativeOverlayConfig,
} from '@monorepo/front-core-lib/fl-portal';
import { flRootInjector } from '@monorepo/front-core-lib/fl-core';


/**
 * Used to opening and closing portal
 * on chart renderer object
 */
export class ChChartPortalHandler {
  private currentHoverOverlay: FlOverlayRef;

  private portalFixed: boolean = false;

  private clickListener: () => void;

  public openPortal(
    element: Element,
    component: ComponentType<any>,
    data: any,
    fixPortal: boolean = false
  ): void {
    // close the existing portal unless existing portal is fixed and new portal is not
    this.closePortal(fixPortal);
    if (this.currentHoverOverlay != null) return;
    this.portalFixed = fixPortal;

    const portalService: FlPortalService = flRootInjector.get(FlPortalService);
    const ngZone: NgZone = flRootInjector.get(NgZone);

    // get the overlay config form config or the default one
    const overlayConfig: FlRelativeOverlayConfig = {
      hasBackdrop: false,
      disposeOnNavigation: true,
      disposeOnOutsideClick: true,
    };

    const positions: ConnectedPosition[] = [
      FlPortalService.getDefaultPosition('right', 10, 0),
      FlPortalService.getDefaultPosition('top', 0, -10),
      FlPortalService.getDefaultPosition('left', -10, 0),
      FlPortalService.getDefaultPosition('bottom', 0, 10),
    ];

    // configure the portal position
    const portalConfig: FlPortalConfig = portalService.configureRelativePortal(
      element,
      positions,
      overlayConfig
    );

    // run the portal in NgZone because all the chart is outside zone
    ngZone.run(() => {
      // create the portal
      this.currentHoverOverlay = portalService.createPortal(component, portalConfig, data);
      this.currentHoverOverlay.detachments().subscribe(() => this.clearListener());
    });
  }

  public openDataWithSeriePortal(
    element: Element,
    data: ChChartDataWithSeriePortalInput,
    fixPortal: boolean = false
  ): void {
    // create the portal
    this.openPortal(element, ChChartDataWithSeriePortalComponent, data, fixPortal);
  }

  public closePortal(closeFixedPortal: boolean = false): void {
    if (!closeFixedPortal && this.portalFixed) return;
    this.currentHoverOverlay?.dispose();
    this.currentHoverOverlay = null;
  }

  private clearListener(): void {
    if (this.clickListener) {
      this.clickListener();
    }
    this.currentHoverOverlay = null;
    this.portalFixed = false;
  }
}
