import { FlUser } from '@monorepo/front-core-lib/fl-user';

export interface CoRagflowChatbotPanelConfig {
  userId?: string;
  conversationId?: string;
  /** Authenticated user, used to display the avatar on user messages */
  user?: FlUser;
  onClose: () => void;
}
