import { TextFieldModule } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import {
  CoRagflowConnectionState,
  CoRagflowMessage,
} from '../../model/co-ragflow-chatbot.class';
import { CoRagflowChatbotService } from '../../service/co-ragflow-chatbot.service';
import { CoRagflowChatMessageComponent } from './co-ragflow-chat-message/co-ragflow-chat-message.component';

@Component({
  selector: 'co-ragflow-chatbot',
  templateUrl: './co-ragflow-chatbot.component.html',
  styleUrls: ['./co-ragflow-chatbot.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class CoRagflowChatbotComponent implements OnInit {
  private chatbotService = inject(CoRagflowChatbotService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('messagesContainer') messagesContainer: ElementRef<HTMLElement>;
  @ViewChild('messageInput') messageInput: ElementRef<HTMLTextAreaElement>;

  /** The Ragflow agent ID to use */
  chatId = input.required<string>();

  /** Optional user ID for authentication */
  userId = input<string>();

  /** Optional conversation ID to resume */
  conversationId = input<string>();

  /** Placeholder text for the input */
  placeholder = input<string>('coCommunityLib.chatbot_placeholder');

  messageCtrl = new FormControl<string>('');

  messages = signal<CoRagflowMessage[]>([]);
  isTyping = signal<boolean>(false);
  streamingContent = signal<string>('');
  connectionState = signal<CoRagflowConnectionState>('disconnected');

  isConnected = computed(() => this.connectionState() === 'connected');
  isConnecting = computed(() => this.connectionState() === 'connecting');
  hasError = computed(() => this.connectionState() === 'error');

  displayMessages = computed(() => {
    const msgs = this.messages();
    const streaming = this.streamingContent();

    if (streaming) {
      // Clean reference markers from streaming content
      const cleanedStreaming = streaming
        .replace(/\s*\[ID:\s*\d+\]/gi, '')
        .replace(/\s*\[\d+\](?=\s*[.,;:]|\s*$)/g, '');
      return [
        ...msgs,
        { role: 'assistant' as const, content: cleanedStreaming },
      ];
    }
    return msgs;
  });

  ngOnInit(): void {
    this.setupSubscriptions();
    this.connect();
  }

  private connect(): void {
    this.chatbotService.connect({
      chatId: this.chatId(),
      userId: this.userId(),
      conversationId: this.conversationId(),
    });
  }

  private setupSubscriptions(): void {
    this.chatbotService.connectionState
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        this.connectionState.set(state);
      });

    this.chatbotService.conversationJoined
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.messages.set(data.messages || []);
        this.scrollToBottom();
      });

    this.chatbotService.typingStart
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isTyping.set(true);
        this.streamingContent.set('');
      });

    this.chatbotService.typingEnd
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isTyping.set(false);
      });

    this.chatbotService.messageChunk
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.streamingContent.update((current) => current + data.content);
        this.scrollToBottom();
      });

    this.chatbotService.messageComplete
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.messages.update((msgs) => [...msgs, { ...data.message, references: data.references }]);
        this.streamingContent.set('');
        this.scrollToBottom();
      });

    this.chatbotService.messageError
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isTyping.set(false);
        this.streamingContent.set('');
      });
  }

  sendMessage(): void {
    const message = this.messageCtrl.value?.trim();
    if (!message || !this.isConnected() || this.isTyping()) return;

    this.messages.update((msgs) => [
      ...msgs,
      { role: 'user', content: message, timestamp: new Date() },
    ]);

    this.chatbotService.sendMessage(message);
    this.messageCtrl.reset();
    this.scrollToBottom();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  reconnect(): void {
    this.connect();
  }

  startNewConversation(): void {
    this.chatbotService.clearConversation(this.chatId());
    this.messages.set([]);
    this.streamingContent.set('');
    this.chatbotService.disconnect();
    this.connect();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const container = this.messagesContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
}
