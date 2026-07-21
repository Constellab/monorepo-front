import { ChangeDetectionStrategy,Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ClHelpService } from '@monorepo/core-lib';
import { FlFormFieldDirective } from '@monorepo/front-core-lib/fl-core';
import { LiAuthenticatedUserService } from '@monorepo/lab-lib/li-core';

import { LiOpenAiChat, LiOpenAiChatMessage } from '../../model/li-open-ai.class';
import {
  LiOpenAiChatMessageAction,
  LiOpenAiChatMessageComponent,
} from '../li-open-ai-chat-message/li-open-ai-chat-message.component';

/**
 * Form component to show an open AI chat with possibility to add or remove messages
 */
@Component({
  selector: 'li-open-ai-chat',
  templateUrl: './li-open-ai-chat.component.html',
  styleUrls: ['./li-open-ai-chat.component.scss'],
  providers: [{ provide: FlFormFieldDirective, useExisting: LiOpenAiChatComponent }],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LiOpenAiChatMessageComponent,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatIconButton,
    MatSuffix,
    MatIcon,
    MatHint,
  ],
})
export class LiOpenAiChatComponent extends FlFormFieldDirective<LiOpenAiChat> {
  private authenticatedUserService = inject(LiAuthenticatedUserService);

  @Input() placeholder: string;
  @Input() hint: string;

  @Output() chatChange: EventEmitter<LiOpenAiChat> = new EventEmitter();

  @ViewChild('textarea', { static: true, read: ElementRef }) textarea: ElementRef<HTMLElement>;

  messageCtrl: FormControl<string> = new FormControl();

  constructor() {
    const ngControl = inject(NgControl, { optional: true, self: true });

    super(ngControl);
  }

  callChangeEvent(value: LiOpenAiChat): void {
    this.chatChange.emit(value);
  }

  onDisableChange(): void {}

  writeValue(obj: LiOpenAiChat): void {
    this.value = {
      messages: obj?.messages ?? [],
    };
  }

  protected convertInnerToOuter(innerValue: LiOpenAiChat): LiOpenAiChat {
    if (innerValue == null) return null;
    // if there is no message consider it as null
    if (ClHelpService.isNullOrEmpty(innerValue.messages)) return null;
    // if there is only one message and it is a system message consider it as null
    if (innerValue.messages.length === 1 && innerValue.messages[0].role === 'system') return null;

    return innerValue;
  }

  onAction(action: LiOpenAiChatMessageAction, message: LiOpenAiChatMessage, index: number): void {
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
