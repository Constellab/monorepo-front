import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';

import {
  CoRagflowChatbotConfig,
  CoRagflowConnectionState,
  CoRagflowConversationJoined,
  CoRagflowMessage,
  CoRagflowMessageChunk,
  CoRagflowMessageComplete,
  CoRagflowMessageError,
} from '../model/co-ragflow-chatbot.class';
import { CoConfig } from './co-service-config.config';

const CONVERSATION_STORAGE_KEY = 'ragflow_conversation_';
const UNAUTHORIZED_CONVERSATION_ERROR = 'Unauthorized: you do not have access to this conversation';

/**
 * @deprecated Use CoRagflowChatbotState instead for component-level state management.
 * This global service is kept for backward compatibility but should not be used in new code.
 * CoRagflowChatbotState is injected at component level and provides better isolation.
 */
@Injectable({
  providedIn: 'root',
})
export class CoRagflowChatbotService implements OnDestroy {
  private coConfig = inject(CoConfig);

  private socket: Socket | null = null;

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

  private currentChatId: string | null = null;

  ngOnDestroy(): void {
    this.disconnect();
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
   * Join a conversation (create new or resume existing)
   */
  private joinConversation(chatId: string, conversationId?: string): void {
    if (!this.socket?.connected) return;

    const payload: { chatId: string; conversationId?: string } = { chatId };
    if (conversationId) {
      payload.conversationId = conversationId;
    }

    this.socket.emit('join_conversation', payload);
  }

  /**
   * Leave the current conversation
   */
  leaveConversation(): void {
    if (this.socket?.connected) {
      this.socket.emit('leave_conversation');
    }
    this.conversationId.set(null);
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
   * Setup all socket event listeners
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on('conversation_joined', (data: CoRagflowConversationJoined) => {
      this.conversationId.set(data.conversationId);
      if (this.currentChatId) {
        this.storeConversationId(this.currentChatId, data.conversationId);
      }
      this.messages.set(data.messages || []);
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

  /**
   * Start a new conversation (clear history and reconnect)
   */
  startNewConversation(chatId: string): void {
    this.clearConversation(chatId);
    this.messages.set([]);
    this.streamingContent.set('');
  }

  /**
   * Clear the stored conversation for a chat, starting fresh on next connect
   */
  clearConversation(chatId: string): void {
    try {
      localStorage.removeItem(CONVERSATION_STORAGE_KEY + chatId);
    } catch {
      // localStorage not available
    }
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
