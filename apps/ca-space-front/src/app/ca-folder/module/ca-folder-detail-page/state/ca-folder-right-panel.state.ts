import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlQueryParamHandler } from '@monorepo/front-core-lib/fl-core';
import { Subscription } from 'rxjs';
import { CaFolderDetailRightPanelComponent } from '../component/ca-folder-detail-right-panel/ca-folder-detail-right-panel.component';
import { ClHelpService } from '@monorepo/core-lib';

export type CaFolderDetailRightPanel = {
  type: 'description' | 'note' | 'chat' | 'settings' | 'constellab-document';
  objectId: string;
};

@Injectable()
export class CaFolderRightPanelState implements OnDestroy {
  private portalService = inject(FlPortalService);
  private viewContainerRef = inject(ViewContainerRef);

  private queryParamHandler: FlQueryParamHandler<CaFolderDetailRightPanel> = inject(FlQueryParamHandler);

  private currentOverlayRef: FlOverlayRef;

  private subscription: Subscription;

  public init(): void {
    this.queryParamHandler.getFirstQueryParams().subscribe((params) => this.onRightPanelUpdate(params));
  }

  public updateRightPanelState(state: CaFolderDetailRightPanel): void {
    this.currentOverlayRef?.dispose();
    this.queryParamHandler.mergeQueryParams({ type: state.type, objectId: state.objectId });
    this.onRightPanelUpdate(state);
  }

  /**
   * Call when a query param change event is triggered
   */
  private onRightPanelUpdate(state: CaFolderDetailRightPanel): void {
    if (ClHelpService.isNullOrEmpty(state)) return;
    if (!state.type) return;

    this.openRightPanel(state);
  }

  private openRightPanel(data: CaFolderDetailRightPanel): void {
    this.currentOverlayRef = this.portalService.createPortal(
      CaFolderDetailRightPanelComponent,
      this.portalService.getRightSidePortalConfig(true, '50rem', false),
      data,
      this.viewContainerRef
    );
    this.subscription = this.currentOverlayRef.detachments().subscribe(() => this.onPortalClose());
  }

  private onPortalClose(): void {
    setTimeout(() => {
      // navigate to the same route, update only the query params
      this.queryParamHandler.mergeQueryParams({ type: null, objectId: null });
    }, 0);
    this.currentOverlayRef = null;
  }

  public closeRightPanel(): void {
    this.currentOverlayRef?.dispose();
  }

  ngOnDestroy(): void {
    // unsubscribe the overlay destroy event to prevent calling queryParamHandler.mergeQueryParams
    // which will trigger a navigation
    this.subscription?.unsubscribe();
  }
}
