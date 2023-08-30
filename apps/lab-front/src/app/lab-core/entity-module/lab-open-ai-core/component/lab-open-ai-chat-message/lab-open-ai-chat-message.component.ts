import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LabOpenAiChatMessage, LabOpenAiChatMessageRole} from '../../model/lab-open-ai.class';

export type LabOpenAiChatMessageAction = 'delete' | 'delete-all';

@Component({
  selector: 'lab-open-ai-chat-message',
  templateUrl: './lab-open-ai-chat-message.component.html',
  styleUrls: ['./lab-open-ai-chat-message.component.scss'],
})
export class LabOpenAiChatMessageComponent implements OnInit{

  @Input() message: LabOpenAiChatMessage;

  @Output() action: EventEmitter<LabOpenAiChatMessageAction> = new EventEmitter();

  showContent : boolean;

  ngOnInit(): void {
    this.showContent = this.message?.role !== 'system';
  }

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

  toggleContent(): void {
    this.showContent = !this.showContent;
  }
}
