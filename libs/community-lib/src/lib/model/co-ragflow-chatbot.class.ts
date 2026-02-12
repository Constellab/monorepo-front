/**
 * Reference to a source document used by Ragflow
 */
export interface CoRagflowReference {
  id: number;
  content: string;
  documentName: string;
  chunkId: string;
  score: number;
}

/**
 * Represents a message in the chatbot conversation
 */
export interface CoRagflowMessage {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  references?: CoRagflowReference[];
}

/**
 * Data received when joining a conversation
 */
export interface CoRagflowConversationJoined {
  conversationId: string;
  sessionId: string;
  messages: CoRagflowMessage[];
}

/**
 * Data received when typing starts or ends
 */
export interface CoRagflowTypingEvent {
  conversationId: string;
}

/**
 * Data received during message streaming
 */
export interface CoRagflowMessageChunk {
  conversationId: string;
  content: string;
}

/**
 * Data received when a message is complete
 */
export interface CoRagflowMessageComplete {
  conversationId: string;
  message: CoRagflowMessage;
  references?: CoRagflowReference[];
}

/**
 * Error data received from the chatbot
 */
export interface CoRagflowMessageError {
  error: string;
  conversationId?: string;
}

/**
 * Configuration for the Ragflow chatbot
 */
export interface CoRagflowChatbotConfig {
  userId?: string;
  conversationId?: string;
}

/**
 * Connection state of the chatbot
 */
export type CoRagflowConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error';
