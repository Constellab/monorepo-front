import { Injectable, OnDestroy, ViewContainerRef } from '@angular/core';
import { FlOverlayRef, FlPortalService, FlQueryParamHandler } from '@monorepo/front-core-lib';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  CaProjectDetailRightPanelComponent
} from '../component/ca-project-detail-right-panel/ca-project-detail-right-panel.component';
import { ClHelpService } from '@monorepo/core-lib';

export type CaProjectDetailRightPanel = {
  type: 'description' | 'report' | 'experiment' | 'chat' | 'settings' | 'constellab-document';
  objectId: string;
}


@Injectable()
export class CaFolderRightPanelState implements OnDestroy {

  private queryParamHandler: FlQueryParamHandler<CaProjectDetailRightPanel>;

  private subscription: Subscription;

  private currentOverlayRef: FlOverlayRef;

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

  public updateRightPanelState(state: CaProjectDetailRightPanel): void {
    this.currentOverlayRef?.dispose();
    this.queryParamHandler.mergeQueryParams(state);
    this.onRightPanelUpdate(state);
  }

  /**
   * Call when a query param change event is triggered
   */
  private onRightPanelUpdate(state: CaProjectDetailRightPanel): void {
    if (ClHelpService.isNullOrEmpty(state)) return;
    if (!state.type) return;

    this.openRightPanel(state);
  }

  private openRightPanel(data: CaProjectDetailRightPanel): void {
    this.currentOverlayRef = this.portalService.createPortal(CaProjectDetailRightPanelComponent,
      this.portalService.getRightSidePortalConfig(true, '33%', false), data, this.viewContainerRef);
    this.currentOverlayRef.detachments().subscribe(() => this.onPortalClose());
  }

  private onPortalClose(): void {
    // navigate to the same route, update only the query params
    this.queryParamHandler.mergeQueryParams({ type: null, objectId: null });
    this.currentOverlayRef = null;
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
