import { TextFieldModule } from '@angular/cdk/text-field';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import { CoRagflowChatbotState } from '../../state/co-ragflow-chatbot.state';
import { CoRagflowChatMessageComponent } from './co-ragflow-chat-message/co-ragflow-chat-message.component';

@Component({
  selector: 'co-ragflow-chatbot',
  templateUrl: './co-ragflow-chatbot.component.html',
  styleUrls: ['./co-ragflow-chatbot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CoRagflowChatbotState],
  imports: [
    ReactiveFormsModule,
    TextFieldModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    CoRagflowChatMessageComponent,
  ],
})
export class CoRagflowChatbotComponent implements OnInit, AfterViewChecked {
  private state = inject(CoRagflowChatbotState);

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLElement>;
  @ViewChild('messageInput') messageInput: ElementRef<HTMLTextAreaElement>;

  /** Optional user ID for authentication */
  userId = input<string>();

  /** Optional conversation ID to resume */
  conversationId = input<string>();

  /** Placeholder text for the input */
  placeholder = input<string>('coCommunityLib.chatbot_placeholder');

  messageCtrl = new FormControl<string>('');

  // Expose state signals directly
  readonly connectionState = this.state.connectionState;
  readonly messages = this.state.messages;
  readonly isTyping = this.state.isTyping;
  readonly streamingContent = this.state.streamingContent;
  readonly isConnected = this.state.isConnected;
  readonly isConnecting = this.state.isConnecting;
  readonly hasError = this.state.hasError;
  readonly displayMessages = this.state.displayMessages;

  private shouldScrollToBottom = false;

  constructor() {
    // Keep the input control's enabled state in sync with the connection/typing
    // state. Driving disabled through the reactive form API (rather than the
    // template [disabled] binding) avoids the ReactiveForms disabled-attribute warning.
    effect(() => {
      const shouldDisable = !this.isConnected() || this.isTyping();
      if (shouldDisable && this.messageCtrl.enabled) {
        this.messageCtrl.disable({ emitEvent: false });
      } else if (!shouldDisable && this.messageCtrl.disabled) {
        this.messageCtrl.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.state.connect({
      userId: this.userId(),
      conversationId: this.conversationId(),
    });
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  sendMessage(): void {
    const message = this.messageCtrl.value?.trim();
    if (!message || !this.isConnected() || this.isTyping()) return;

    this.state.sendMessage(message);
    this.messageCtrl.reset();
    this.shouldScrollToBottom = true;
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  reconnect(): void {
    this.state.connect({
      userId: this.userId(),
      conversationId: this.conversationId(),
    });
  }

  startNewConversation(): void {
    this.state.startNewConversation();
    this.state.disconnect();
    this.state.connect({
      userId: this.userId(),
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const container = this.messagesContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }
}
