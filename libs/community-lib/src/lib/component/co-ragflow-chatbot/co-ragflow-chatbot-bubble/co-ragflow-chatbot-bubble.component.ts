import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlUser } from '@monorepo/front-core-lib/fl-user';

import { CoRagflowChatbotService } from '../co-ragflow-chatbot.service';

@Component({
  selector: 'co-ragflow-chatbot-bubble',
  templateUrl: './co-ragflow-chatbot-bubble.component.html',
  styleUrls: ['./co-ragflow-chatbot-bubble.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButtonModule, MatIconModule],
})
export class CoRagflowChatbotBubbleComponent {
  private chatbotService = inject(CoRagflowChatbotService);

  /** Optional user ID for authentication */
  userId = input<string>();

  /** Optional conversation ID to resume */
  conversationId = input<string>();

  /** Optional authenticated user, used to display the avatar on user messages */
  user = input<FlUser>();

  readonly isOpen = this.chatbotService.isOpen;

  toggle(): void {
    this.chatbotService.toggle({
      userId: this.userId(),
      conversationId: this.conversationId(),
      user: this.user(),
    });
  }
}
