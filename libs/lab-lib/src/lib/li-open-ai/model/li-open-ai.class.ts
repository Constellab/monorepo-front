export type LiOpenAiChatMessageRole = 'system' | 'user' | 'assistant';

export interface LiOpenAiChatMessage {
  role: LiOpenAiChatMessageRole;
  content: string;
  user_id?: string;
}

export interface LiOpenAiChat {
  messages: LiOpenAiChatMessage[];
}
