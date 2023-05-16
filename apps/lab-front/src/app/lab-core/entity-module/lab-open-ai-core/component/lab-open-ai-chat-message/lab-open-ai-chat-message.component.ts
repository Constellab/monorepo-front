import {Component, EventEmitter, Input, Output} from '@angular/core';
import {LabOpenAiChatMessage, LabOpenAiChatMessageRole} from '../../model/lab-open-ai.class';

export type LabOpenAiChatMessageAction = 'delete' | 'delete-all';

@Component({
  selector: 'lab-open-ai-chat-message',
  templateUrl: './lab-open-ai-chat-message.component.html',
  styleUrls: ['./lab-open-ai-chat-message.component.scss'],
})
export class LabOpenAiChatMessageComponent {

  @Input() message: LabOpenAiChatMessage;

  @Output() action: EventEmitter<LabOpenAiChatMessageAction> = new EventEmitter();

  get role(): LabOpenAiChatMessageRole {
    return this.message?.role ?? null;
  }

  get icon(): string {
    switch (this.role) {
      case 'user':
        return 'person';
      case 'assistant':
        return 'smart_toy';
      case 'system':
        return 'settings_suggest';
      default:
        return 'android';
    }
  }

  onAction(action: LabOpenAiChatMessageAction): void {
    this.action.emit(action);
  }
}
