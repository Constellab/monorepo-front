export interface CoRagflowChatbotPanelConfig {
  chatId: string;
  userId?: string;
  conversationId?: string;
  onClose: () => void;
}
