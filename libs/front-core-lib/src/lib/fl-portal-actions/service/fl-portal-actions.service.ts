import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { FlWindowsHelper } from '@monorepo/front-core-lib/fl-core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { Observable } from 'rxjs';

import { FlPortalActionsComponent } from '../component/fl-portal-actions/fl-portal-actions.component';
import { FlPortalAction, FlPortalActionResult } from '../model/fl-portal-actions.class';
import { FlPortalActionsState } from './fl-portal-actions.state';

/**
 * Singleton to manager the portal actions
 */
@Injectable()
export class FlPortalActionsService {
  private portalService = inject(FlPortalService);
  private actionsState = inject(FlPortalActionsState);
  private dialogService = inject(FlDialogService);
  private platformId = inject(PLATFORM_ID);

  //provided if a portal is currently opened
  private currentOverlay: FlOverlayRef = null;

  private autoCloseDelay: number = 3000;
  private autoCloseTimer: any = null;

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Subscribe to progress state changes to block/unblock window close
    this.actionsState.hasProgressAction$().subscribe((hasProgress) => {
      if (hasProgress) {
        FlWindowsHelper.blockWindowsClose();
      } else {
        FlWindowsHelper.unblockWindowsClose();
      }
    });

    // Subscribe to all actions finished for auto-close
    this.actionsState.allActionsFinished$().subscribe(({ finished, shouldAutoClose }) => {
      if (finished && shouldAutoClose) {
        // Start auto-close timer
        this.clearAutoCloseTimer();
        this.autoCloseTimer = setTimeout(() => this.closeOverlay(), this.autoCloseDelay);
      } else if (!finished) {
        // New action added, clear the timer
        this.clearAutoCloseTimer();
      }
    });
  }

  /**
   * Add an action or multiple actions to the action portal
   * If portal is closed, it opens it
   * @param action
   * @param openPortal when false the portal is not opened if it doesn't exist
   */
  public addAction<T>(
    action: FlPortalAction<T>,
    openPortal: boolean = true
  ): Observable<FlPortalActionResult<T>> {
    if (action == null) return null;
    // clear the auto close timer if it exists
    this.clearAutoCloseTimer();

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
      { right: '80px', bottom: '10px' },
      { panelClass: 'g-print-hide' }
    );

    // open portal
    this.currentOverlay = this.portalService.createPortal(FlPortalActionsComponent, portalConfig);

    this.currentOverlay.detachments().subscribe(() => this.onPortalClosed());

    return obs;
  }

  private onPortalClosed(): void {
    this.currentOverlay = null;
    this.actionsState.unsubscribeAll();
  }

  public closeActionsPortal(): void {
    // if some action with track http events are running, we can't show a warning
    if (this.actionsState.containsRunningTrackHttpAction()) {
      const dialogData: FlConfirmDialogInput = {
        title: 'flPortalAction.cancelActions',
        content: 'flPortalAction.cancelActionsConfirmation',
      };

      this.dialogService
        .openConfirmDialog(dialogData)
        .afterClosed()
        .subscribe((result: FlConfirmDialogResult) => {
          if (result.choice) {
            this.closeOverlay();
          }
        });
    } else {
      this.closeOverlay();
    }
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

  private clearAutoCloseTimer(): void {
    if (this.autoCloseTimer != null) {
      clearTimeout(this.autoCloseTimer);
    }
  }
}
