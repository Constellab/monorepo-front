import { Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlOverlayRef, FlPortalService, FlQueryParamHandler } from '@monorepo/front-core-lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CaFolderDetailRightPanelComponent
} from '../component/ca-folder-detail-right-panel/ca-folder-detail-right-panel.component';
import { ClHelpService } from '@monorepo/core-lib';

export type CaFolderDetailRightPanel = {
  type: 'description' | 'report' | 'experiment' | 'chat' | 'settings' | 'constellab-document';
  objectId: string;
  objectName: string;
}


@Injectable()
export class CaFolderRightPanelState implements OnDestroy {

  private queryParamHandler: FlQueryParamHandler<CaFolderDetailRightPanel>;


  private currentOverlayRef: FlOverlayRef;

  private subscription: Subscription;

  constructor(private portalService: FlPortalService,
              route: ActivatedRoute,
              router: Router,
              private viewContainerRef: ViewContainerRef) {
    this.queryParamHandler = new FlQueryParamHandler(router, route);
  }

  public init(): void {
    this.queryParamHandler.getFirstQueryParams().subscribe(
      params => this.onRightPanelUpdate(params)
    );
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
    this.currentOverlayRef = this.portalService.createPortal(CaFolderDetailRightPanelComponent,
      this.portalService.getRightSidePortalConfig(true, '50rem', false), data, this.viewContainerRef);
    this.subscription = this.currentOverlayRef.detachments().subscribe(() => this.onPortalClose());
  }

  private onPortalClose(): void {
    // navigate to the same route, update only the query params
    this.queryParamHandler.mergeQueryParams({ type: null, objectId: null });
    this.currentOverlayRef = null;
  }


  ngOnDestroy(): void {
    // unsubscribe the overlay destroy event to prevent calling queryParamHandler.mergeQueryParams which will trigger a navigation
    this.subscription?.unsubscribe();
  }
}
