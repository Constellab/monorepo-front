import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FlMarkdownModule } from '@monorepo/front-core-lib/fl-markdown';
import { FlUser, FlUserModule } from '@monorepo/front-core-lib/fl-user';

import { CoRagflowMessage } from '../../../model/co-ragflow-chatbot.class';

@Component({
  selector: 'co-ragflow-chat-message',
  templateUrl: './co-ragflow-chat-message.component.html',
  styleUrls: ['./co-ragflow-chat-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, FlMarkdownModule, FlUserModule],
})
export class CoRagflowChatMessageComponent {
  message = input.required<CoRagflowMessage>();

  /** Optional authenticated user, used to display the avatar on user messages */
  user = input<FlUser>();

  isUser = computed(() => this.message().role === 'user');
  isAssistant = computed(() => this.message().role === 'assistant');

  /** Content with reference markers removed or formatted */
  formattedContent = computed(() => {
    const content = this.message().content;

    // Remove various reference marker formats:
    // [ID:x], [ID: x], [x] (standalone numbers in brackets at end of sentences)
    return content
      .replace(/\s*\[ID:\s*\d+\]/gi, '') // Remove [ID:x] format
      .replace(/\s*\[\d+\](?=\s*[.,;:]|\s*$)/g, ''); // Remove [x] at end of sentences
  });
}
