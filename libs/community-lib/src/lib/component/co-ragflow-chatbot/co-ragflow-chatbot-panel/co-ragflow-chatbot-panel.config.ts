import { InjectionToken } from '@angular/core';

export interface CoRagflowChatbotPanelConfig {
  chatId: string;
  userId?: string;
  conversationId?: string;
  onClose: () => void;
}

export const CO_RAGFLOW_CHATBOT_CONFIG = new InjectionToken<CoRagflowChatbotPanelConfig>(
  'CO_RAGFLOW_CHATBOT_CONFIG'
);
