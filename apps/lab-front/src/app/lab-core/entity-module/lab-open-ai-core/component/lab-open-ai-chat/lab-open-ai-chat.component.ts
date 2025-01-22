import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject } from '@angular/core';
import { FlFormFieldDirective } from '@monorepo/front-core-lib';
import { LabOpenAiChat, LabOpenAiChatMessage } from '../../model/lab-open-ai.class';
import { FormControl, NgControl } from '@angular/forms';
import { ClHelpService } from '@monorepo/core-lib';
import { LabAuthenticatedUserService } from '../../../../service/lab-authenticated-user.service';
import { LabOpenAiChatMessageAction } from '../lab-open-ai-chat-message/lab-open-ai-chat-message.component';

/**
 * Form component to show an open AI chat with possibility to add or remove messages
 */
@Component({
  selector: 'lab-open-ai-chat',
  templateUrl: './lab-open-ai-chat.component.html',
  styleUrls: ['./lab-open-ai-chat.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LabOpenAiChatComponent }],
  standalone: false,
})
export class LabOpenAiChatComponent extends FlFormFieldDirective<LabOpenAiChat> {
  private authenticatedUserService = inject(LabAuthenticatedUserService);

  @Input() placeholder: string;
  @Input() hint: string;

  @Output() chatChange: EventEmitter<LabOpenAiChat> = new EventEmitter();

  @ViewChild('textarea', { static: true, read: ElementRef }) textarea: ElementRef<HTMLElement>;

  messageCtrl: FormControl<string> = new FormControl();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  callChangeEvent(value: LabOpenAiChat): void {
    this.chatChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: LabOpenAiChat): void {
    this.value = {
      messages: obj?.messages ?? [],
    };
  }

  protected convertInnerToOuter(innerValue: LabOpenAiChat): LabOpenAiChat {
    if (innerValue == null) return null;
    // if there is no message consider it as null
    if (ClHelpService.isNullOrEmpty(innerValue.messages)) return null;
    // if there is only one message and it is a system message consider it as null
    if (innerValue.messages.length === 1 && innerValue.messages[0].role === 'system') return null;

    return innerValue;
  }

  onAction(action: LabOpenAiChatMessageAction, message: LabOpenAiChatMessage, index: number): void {
    switch (action) {
      case 'delete':
        this.deleteMessage(index);
        break;
      case 'delete-all':
        this.deleteAllMessages();
        break;
    }
  }

  private deleteMessage(index: number): void {
    const value = ClHelpService.deepClone(this.value);

    value.messages.splice(index, 1);
    this.setAndEmitValue(value);
  }

  private deleteAllMessages(): void {
    const value = ClHelpService.deepClone(this.value);

    value.messages = [];
    this.setAndEmitValue(value);
  }

  addMessage(): void {
    if (ClHelpService.isNullOrEmpty(this.messageCtrl.value)) return;
    const value = ClHelpService.deepClone(this.value);

    value.messages.push({
      role: 'user',
      content: this.messageCtrl.value,
      user_id: this.authenticatedUserService.getCurrentUser()?.id,
    });

    this.setAndEmitValue(value);
    this.messageCtrl.reset();
  }

  onEnter(event: Event): void {
    ClHelpService.stopEventPropagation(event);
    this.addMessage();
  }
}
