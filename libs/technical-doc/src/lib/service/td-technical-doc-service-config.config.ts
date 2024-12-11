import { TdTypingName } from '../model/td-typing-name.class';

export interface TdTechnicalDocUrl {
  isAbsolute: boolean;
  url: string;
}

export abstract class TdTechnicalDocServiceConfig {
  /**
   * Get the unique technical documentation url
   * Result can be an absolute link or not
   */
  public abstract getTechnicalDocUrl(parentVersion: string, typingName: TdTypingName): TdTechnicalDocUrl;

  public abstract getCommunityIconBaseApiUrl(): string;
}
