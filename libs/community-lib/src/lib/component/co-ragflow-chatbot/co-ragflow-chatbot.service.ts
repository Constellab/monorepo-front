import { BreakpointObserver } from '@angular/cdk/layout';
import { ElementRef, inject, Injectable, signal } from '@angular/core';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';
import { FlUser } from '@monorepo/front-core-lib/fl-user';

import { CoRagflowChatbotPanelComponent } from './co-ragflow-chatbot-panel/co-ragflow-chatbot-panel.component';
import { CoRagflowChatbotPanelConfig } from './co-ragflow-chatbot-panel/co-ragflow-chatbot-panel.config';

export interface CoRagflowChatbotOpenConfig {
  /** Optional user ID for authentication */
  userId?: string;

  /** Optional conversation ID to resume */
  conversationId?: string;

  /** Optional authenticated user, used to display the avatar on user messages */
  user?: FlUser;

  /**
   * Optional trigger element. When provided (on a large screen), the panel is
   * anchored to this element: its bottom-left corner sits to the right of the
   * element with a small gap. Without it, the panel floats at the bottom-right
   * of the viewport (the floating-bubble behavior).
   */
  origin?: Element | ElementRef;
}

/** Small gap in px between the trigger element and the anchored panel. */
const ANCHOR_GAP = 8;

/**
 * Shared logic to open/close the chatbot panel. Used by the floating bubble
 * (lab & community) and by any other trigger (e.g. the space main-menu button)
 * so that the panel-open behavior lives in a single place, independent of the
 * trigger's own layout/positioning.
 */
@Injectable({
  providedIn: 'root',
})
export class CoRagflowChatbotService {
  private portalService = inject(FlPortalService);
  private breakpointObserver = inject(BreakpointObserver);

  readonly isOpen = signal(false);

  private overlayRef: FlOverlayRef | null = null;

  toggle(config?: CoRagflowChatbotOpenConfig): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open(config);
    }
  }

  open(config?: CoRagflowChatbotOpenConfig): void {
    if (this.overlayRef) return;

    const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 480px)');

    const panelConfig: CoRagflowChatbotPanelConfig = {
      userId: config?.userId,
      conversationId: config?.conversationId,
      user: config?.user,
      onClose: () => this.close(),
    };

    let portalConfig: FlPortalConfig;

    if (isSmallScreen) {
      portalConfig = this.portalService.configureAbsolutePortal(
        { top: '0', left: '0' },
        {
          width: '100vw',
          height: '100vh',
          hasBackdrop: true,
          disposeOnBackdropClick: true,
          backdropClass: 'co-chatbot-backdrop',
          panelClass: 'co-chatbot-panel',
        }
      );
    } else if (config?.origin) {
      // Anchor the panel to the trigger element: the panel's bottom-left corner
      // sits to the right of the element (its bottom edge), with a small gap.
      portalConfig = this.portalService.configureRelativePortal(
        config.origin,
        [
          {
            originX: 'end',
            overlayX: 'start',
            originY: 'bottom',
            overlayY: 'bottom',
            offsetX: ANCHOR_GAP,
          },
        ],
        {
          hasBackdrop: false,
          disposeOnOutsideClick: true,
          panelClass: 'co-chatbot-panel',
        }
      );
    } else {
      portalConfig = this.portalService.configureAbsolutePortal(
        { bottom: '90px', right: '24px' },
        {
          hasBackdrop: false,
          disposeOnOutsideClick: true,
          panelClass: 'co-chatbot-panel',
        }
      );
    }

    this.overlayRef = this.portalService.createPortal(
      CoRagflowChatbotPanelComponent,
      portalConfig,
      panelConfig
    );

    this.isOpen.set(true);

    this.overlayRef.detachments().subscribe(() => {
      this.overlayRef = null;
      this.isOpen.set(false);
    });
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
  }
}
