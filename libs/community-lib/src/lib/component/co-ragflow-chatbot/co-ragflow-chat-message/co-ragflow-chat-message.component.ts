import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { CoRagflowMessage } from '../../../model/co-ragflow-chatbot.class';

@Component({
  selector: 'co-ragflow-chat-message',
  templateUrl: './co-ragflow-chat-message.component.html',
  styleUrls: ['./co-ragflow-chat-message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule],
})
export class CoRagflowChatMessageComponent {
  message = input.required<CoRagflowMessage>();

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
