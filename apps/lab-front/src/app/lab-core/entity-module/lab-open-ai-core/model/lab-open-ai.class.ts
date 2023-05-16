export type LabOpenAiChatMessageRole = 'system' | 'user' | 'assistant';

export interface LabOpenAiChatMessage {
  role: LabOpenAiChatMessageRole;
  content: string;
  user_id?: string;
}

export interface LabOpenAiChat {
  messages: LabOpenAiChatMessage[];
}
