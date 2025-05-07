import { inject, Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
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

  private currentOverlayRef: FlOverlayRef;

  private subscription: Subscription;

  public updateRightPanelState(state: CaFolderDetailRightPanel): void {
    this.currentOverlayRef?.dispose();
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
