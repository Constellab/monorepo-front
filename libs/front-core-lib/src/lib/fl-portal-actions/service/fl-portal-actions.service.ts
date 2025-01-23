import { Injectable, inject } from '@angular/core';
import { FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalAction, FlPortalActionResult } from '../model/fl-portal-actions.class';
import { FlPortalConfig } from '@monorepo/front-core-lib/fl-portal';
import { FlPortalActionsComponent } from '../component/fl-portal-actions/fl-portal-actions.component';
import { FlPortalActionsState } from './fl-portal-actions.state';
import { Observable } from 'rxjs';
import { FlOverlayRef } from '@monorepo/front-core-lib/fl-portal';

/**
 * Singleton to manager the portal actions
 */
@Injectable()
export class FlPortalActionsService {
  private portalService = inject(FlPortalService);
  private actionsState = inject(FlPortalActionsState);

  //provided if a portal is currently opened
  private currentOverlay: FlOverlayRef = null;

  private autoClose: boolean = false;
  private autoCloseDelay: number = 3000;
  private autoCloseTimer: any = null;

  constructor() {
    const actionsState = this.actionsState;

    actionsState.getResult$().subscribe(() => this.onResult());
  }

  /**
   * Add an action or multiple actions to the action portal
   * If portal is closed, it opens it
   * @param action
   * @param autoClose if true, the portal is close after all the action finished (with a small delay)
   * @param openPortal when false the portal is not opened if it doesn't exist
   */
  public addAction(
    action: FlPortalAction,
    autoClose?: boolean,
    openPortal: boolean = true
  ): Observable<FlPortalActionResult> {
    if (action == null) return null;
    // clear the auto close timer if it exists
    this.clearAutoCloseTimer();

    // update the auto close value
    if (autoClose != null) {
      this.autoClose = autoClose;
    }

    if (this.currentOverlay != null) {
      return this.actionsState.appendAction(action);
    } else if (!openPortal) {
      // if we don't open the portal, only set actions
      return this.actionsState.setAction(action);
    } else {
      return this.openPortal(action);
    }
  }

  private openPortal(action: FlPortalAction): Observable<FlPortalActionResult> {
    // clear the action list
    const obs = this.actionsState.setAction(action);

    // set portal on bottom right
    const portalConfig: FlPortalConfig = this.portalService.configureAbsolutePortal(
      { right: '75px', bottom: '10px' },
      { panelClass: 'g-print-hide' }
    );

    // open portal
    this.currentOverlay = this.portalService.createPortal(FlPortalActionsComponent, portalConfig);

    this.currentOverlay.detachments().subscribe(() => this.onPortalClosed());

    return obs;
  }

  private onPortalClosed(): void {
    this.currentOverlay = null;
  }

  private closeOverlay(): void {
    this.currentOverlay?.dispose();
  }

  /**
   * Subscribe to the result
   * @param type if provided, only emit result for actions of type
   */
  public getResult$(type: string | string[] = []): Observable<FlPortalActionResult> {
    return this.actionsState.getResult$(type);
  }

  // each time a result is emitted, check if auto close is set and if all action are finished
  private onResult(): void {
    if (this.autoClose && this.actionsState.allActionFinished()) {
      // call close with a delay
      this.autoCloseTimer = setTimeout(() => this.checkAndAutoClose(), this.autoCloseDelay);
    }
  }

  // called after a delay, check if all actions are still finished and close if yes
  private checkAndAutoClose(): void {
    if (this.actionsState.allActionFinished()) {
      this.closeOverlay();
    }
  }

  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer != null) {
      clearTimeout(this.autoCloseTimer);
    }
  }
}
