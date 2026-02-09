import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlOverlayRef, FlPortalConfig, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import { CoRagflowChatbotPanelComponent } from '../co-ragflow-chatbot-panel/co-ragflow-chatbot-panel.component';
import { CoRagflowChatbotPanelConfig } from '../co-ragflow-chatbot-panel/co-ragflow-chatbot-panel.config';

@Component({
  selector: 'co-ragflow-chatbot-bubble',
  templateUrl: './co-ragflow-chatbot-bubble.component.html',
  styleUrls: ['./co-ragflow-chatbot-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class CoRagflowChatbotBubbleComponent implements OnDestroy {
  private portalService = inject(FlPortalService);
  private breakpointObserver = inject(BreakpointObserver);

  /** The Ragflow agent ID to use */
  chatId = input.required<string>();

  /** Optional user ID for authentication */
  userId = input<string>();

  /** Optional conversation ID to resume */
  conversationId = input<string>();

  isOpen = signal(false);

  private overlayRef: FlOverlayRef | null = null;

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.overlayRef) return;

    const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 480px)');

    const config: CoRagflowChatbotPanelConfig = {
      chatId: this.chatId(),
      userId: this.userId(),
      conversationId: this.conversationId(),
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
    } else {
      portalConfig = this.portalService.configureAbsolutePortal(
        { bottom: '90px', right: '24px' },
        {
          hasBackdrop: true,
          disposeOnBackdropClick: true,
          backdropClass: 'co-chatbot-backdrop',
          panelClass: 'co-chatbot-panel',
        }
      );
    }

    this.overlayRef = this.portalService.createPortal(CoRagflowChatbotPanelComponent, portalConfig, config);

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

  ngOnDestroy(): void {
    this.close();
  }
}
