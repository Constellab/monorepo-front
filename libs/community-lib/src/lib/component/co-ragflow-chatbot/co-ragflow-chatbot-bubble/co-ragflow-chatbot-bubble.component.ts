import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CoRagflowChatbotPanelComponent } from '../co-ragflow-chatbot-panel/co-ragflow-chatbot-panel.component';
import { CO_RAGFLOW_CHATBOT_CONFIG, CoRagflowChatbotPanelConfig } from '../co-ragflow-chatbot-panel/co-ragflow-chatbot-panel.config';

@Component({
  selector: 'co-ragflow-chatbot-bubble',
  templateUrl: './co-ragflow-chatbot-bubble.component.html',
  styleUrls: ['./co-ragflow-chatbot-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class CoRagflowChatbotBubbleComponent implements OnDestroy {
  private overlay = inject(Overlay);
  private injector = inject(Injector);
  private destroyRef = inject(DestroyRef);

  /** The Ragflow agent ID to use */
  chatId = input.required<string>();

  /** Optional user ID for authentication */
  userId = input<string>();

  /** Optional conversation ID to resume */
  conversationId = input<string>();

  isOpen = signal(false);

  private overlayRef: OverlayRef | null = null;

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.overlayRef) return;

    const isSmallScreen = window.innerWidth <= 480;
    const positionStrategy = isSmallScreen
      ? this.overlay.position().global().top('0').left('0')
      : this.overlay.position().global().bottom('90px').right('24px');

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: !isSmallScreen,
      backdropClass: 'co-chatbot-backdrop',
      panelClass: 'co-chatbot-panel',
    });

    const config: CoRagflowChatbotPanelConfig = {
      chatId: this.chatId(),
      userId: this.userId(),
      conversationId: this.conversationId(),
      onClose: () => this.close(),
    };

    const injector = this.createInjector(config);
    const portal = new ComponentPortal(CoRagflowChatbotPanelComponent, null, injector);

    this.overlayRef.attach(portal);
    this.isOpen.set(true);

    this.overlayRef
      .backdropClick()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.close());
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

  private createInjector(config: CoRagflowChatbotPanelConfig): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [{ provide: CO_RAGFLOW_CHATBOT_CONFIG, useValue: config }],
    });
  }
}
