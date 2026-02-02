import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

import {
  CoRagflowChatbotConfig,
  CoRagflowConnectionState,
  CoRagflowConversationJoined,
  CoRagflowMessageChunk,
  CoRagflowMessageComplete,
  CoRagflowMessageError,
  CoRagflowTypingEvent,
} from '../model/co-ragflow-chatbot.class';
import { CoConfig } from './co-service-config.config';

@Injectable({
  providedIn: 'root',
})
export class CoRagflowChatbotService implements OnDestroy {
  private coConfig = inject(CoConfig);

  private socket: Socket | null = null;

  private connectionState$ = new BehaviorSubject<CoRagflowConnectionState>('disconnected');
  private conversationJoined$ = new Subject<CoRagflowConversationJoined>();
  private typingStart$ = new Subject<CoRagflowTypingEvent>();
  private typingEnd$ = new Subject<CoRagflowTypingEvent>();
  private messageChunk$ = new Subject<CoRagflowMessageChunk>();
  private messageComplete$ = new Subject<CoRagflowMessageComplete>();
  private messageError$ = new Subject<CoRagflowMessageError>();

  private currentConversationId: string | null = null;
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
    this.connectionState$.next('connecting');

    const apiUrl = this.coConfig.getCommunityApiUrl();
    this.socket = io(`${apiUrl}/ragflow-chatbot`, {
      auth: {
        userId: config.userId,
      },
    });

    this.setupSocketListeners();

    this.socket.on('connect', () => {
      this.connectionState$.next('connected');
      this.joinConversation(config.chatId, config.conversationId);
    });

    this.socket.on('disconnect', () => {
      this.connectionState$.next('disconnected');
    });

    this.socket.on('connect_error', () => {
      this.connectionState$.next('error');
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
    this.connectionState$.next('disconnected');
    this.currentConversationId = null;
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
    this.currentConversationId = null;
  }

  /**
   * Send a message to the chatbot
   */
  sendMessage(message: string): void {
    if (!this.socket?.connected || !this.currentChatId) return;

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
      this.currentConversationId = data.conversationId;
      this.conversationJoined$.next(data);
    });

    this.socket.on('typing_start', (data: CoRagflowTypingEvent) => {
      this.typingStart$.next(data);
    });

    this.socket.on('typing_end', (data: CoRagflowTypingEvent) => {
      this.typingEnd$.next(data);
    });

    this.socket.on('message_chunk', (data: CoRagflowMessageChunk) => {
      this.messageChunk$.next(data);
    });

    this.socket.on('message_complete', (data: CoRagflowMessageComplete) => {
      this.messageComplete$.next(data);
    });

    this.socket.on('message_error', (data: CoRagflowMessageError) => {
      this.messageError$.next(data);
    });
  }

  // Observable getters

  get connectionState(): Observable<CoRagflowConnectionState> {
    return this.connectionState$.asObservable();
  }

  get conversationJoined(): Observable<CoRagflowConversationJoined> {
    return this.conversationJoined$.asObservable();
  }

  get typingStart(): Observable<CoRagflowTypingEvent> {
    return this.typingStart$.asObservable();
  }

  get typingEnd(): Observable<CoRagflowTypingEvent> {
    return this.typingEnd$.asObservable();
  }

  get messageChunk(): Observable<CoRagflowMessageChunk> {
    return this.messageChunk$.asObservable();
  }

  get messageComplete(): Observable<CoRagflowMessageComplete> {
    return this.messageComplete$.asObservable();
  }

  get messageError(): Observable<CoRagflowMessageError> {
    return this.messageError$.asObservable();
  }

  get conversationId(): string | null {
    return this.currentConversationId;
  }
}
