import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { io, Socket } from 'socket.io-client';

import { CoConfig } from '../co-community-lib.module';
import {
  CoRagflowChatbotConfig,
  CoRagflowConnectionState,
  CoRagflowConversationJoined,
  CoRagflowMessage,
  CoRagflowMessageChunk,
  CoRagflowMessageComplete,
  CoRagflowMessageError,
} from '../model/co-ragflow-chatbot.class';

const CONVERSATION_STORAGE_KEY = 'ragflow_conversation_';
const UNAUTHORIZED_CONVERSATION_ERROR = 'Unauthorized: you do not have access to this conversation';

/**
 * State management for the Ragflow chatbot component
 * This is a component-level state that should be provided at the component level
 */
@Injectable()
export class CoRagflowChatbotState {
  private coConfig = inject(CoConfig);
  private translateService = inject(TranslateService);
  private destroyRef = inject(DestroyRef);

  private socket: Socket | null = null;
  private currentChatId: string | null = null;

  // Signals
  readonly connectionState = signal<CoRagflowConnectionState>('disconnected');
  readonly messages = signal<CoRagflowMessage[]>([]);
  readonly isTyping = signal<boolean>(false);
  readonly streamingContent = signal<string>('');
  readonly conversationId = signal<string | null>(null);

  // Computed signals
  readonly isConnected = computed(() => this.connectionState() === 'connected');
  readonly isConnecting = computed(() => this.connectionState() === 'connecting');
  readonly hasError = computed(() => this.connectionState() === 'error');
  readonly displayMessages = computed(() => {
    const msgs = this.messages();
    const streaming = this.streamingContent();
    if (streaming) {
      return [...msgs, { role: 'assistant' as const, content: streaming }];
    }
    return msgs;
  });

  constructor() {
    // Cleanup on component destroy
    this.destroyRef.onDestroy(() => {
      this.disconnect();
    });
  }

  /**
   * Connect to the Ragflow chatbot WebSocket
   */
  connect(config: CoRagflowChatbotConfig): void {
    if (this.socket?.connected) {
      this.disconnect();
    }

    this.currentChatId = config.chatId;
    this.connectionState.set('connecting');

    const apiUrl = this.coConfig.getCommunityApiUrl();

    this.socket = io(`${apiUrl}/ragflow-chatbot`, {
      withCredentials: true, // Send HTTPOnly cookies with the WebSocket connection
    });

    this.setupSocketListeners();

    this.socket.on('connect', () => {
      this.connectionState.set('connected');
      // Use provided conversationId or try to restore from storage
      const conversationId = config.conversationId || this.getStoredConversationId(config.chatId);
      this.joinConversation(config.chatId, conversationId);
    });

    this.socket.on('disconnect', () => {
      this.connectionState.set('disconnected');
    });

    this.socket.on('connect_error', () => {
      this.connectionState.set('error');
    });
  }

  /**
   * Disconnect from the WebSocket
   */
  disconnect(): void {
    if (this.socket) {
      this.leaveConversation();
      this.socket.disconnect();
      this.socket = null;
    }
    this.connectionState.set('disconnected');
    this.conversationId.set(null);
    this.currentChatId = null;
  }

  /**
   * Send a message to the chatbot
   */
  sendMessage(message: string): void {
    if (!this.socket?.connected || !this.currentChatId) return;

    // Add user message to the messages list
    this.messages.update((msgs) => [...msgs, { role: 'user', content: message, timestamp: new Date() }]);

    this.socket.emit('send_message', {
      chatId: this.currentChatId,
      message,
    });
  }

  /**
   * Start a new conversation (clear history and reconnect)
   */
  startNewConversation(chatId: string): void {
    this.clearConversation(chatId);
    this.messages.set([]);
    this.streamingContent.set('');
  }

  /**
   * Clear the stored conversation for a chat
   */
  clearConversation(chatId: string): void {
    try {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY + chatId);
    } catch {
      // localStorage not available
    }
  }

  // Private methods

  private joinConversation(chatId: string, conversationId?: string): void {
    if (!this.socket?.connected) return;

    const payload: { chatId: string; conversationId?: string } = { chatId };
    if (conversationId) {
      payload.conversationId = conversationId;
    }

    this.socket.emit('join_conversation', payload);
  }

  private leaveConversation(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_conversation');
    }
    this.conversationId.set(null);
  }

  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('conversation_joined', (data: CoRagflowConversationJoined) => {
      this.conversationId.set(data.conversationId);
      if (this.currentChatId) {
        this.storeConversationId(this.currentChatId, data.conversationId);
      }

      const messages = data.messages || [];
      // Add welcome message for new conversations
      if (messages.length === 0) {
        const welcomeMessage: CoRagflowMessage = {
          role: 'assistant',
          content: this.translateService.instant('coCommunityLib.chatbot_welcome_message'),
        };
        this.messages.set([welcomeMessage]);
      } else {
        this.messages.set(messages);
      }
    });

    this.socket.on('typing_start', () => {
      this.isTyping.set(true);
      this.streamingContent.set('');
    });

    this.socket.on('typing_end', () => {
      this.isTyping.set(false);
    });

    this.socket.on('message_chunk', (data: CoRagflowMessageChunk) => {
      this.streamingContent.update((current) => current + data.content);
    });

    this.socket.on('message_complete', (data: CoRagflowMessageComplete) => {
      this.messages.update((msgs) => [...msgs, { ...data.message, references: data.references }]);
      this.streamingContent.set('');
    });

    this.socket.on('message_error', (data: CoRagflowMessageError) => {
      this.isTyping.set(false);
      this.streamingContent.set('');

      // Handle unauthorized conversation access - create a new conversation
      if (data.error === UNAUTHORIZED_CONVERSATION_ERROR && this.currentChatId) {
        this.clearConversation(this.currentChatId);
        this.joinConversation(this.currentChatId);
        return;
      }

      console.error('Message error:', data.error);
    });
  }

  private storeConversationId(chatId: string, conversationId: string): void {
    try {
      localStorage.setItem(CONVERSATION_STORAGE_KEY + chatId, conversationId);
    } catch {
      // localStorage not available
    }
  }

  private getStoredConversationId(chatId: string): string | undefined {
    try {
      return localStorage.getItem(CONVERSATION_STORAGE_KEY + chatId) || undefined;
    } catch {
      return undefined;
    }
  }
}
