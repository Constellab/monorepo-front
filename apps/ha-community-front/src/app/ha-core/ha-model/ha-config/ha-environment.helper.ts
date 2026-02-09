import { environment } from '../../../../environments/ha-environment';
import { HaEnvironment } from '../../../../environments/ha-environment.class';

export class HaEnvironmentHelper {
  public static getEnv(): HaEnvironment {
    environment.settings = {
      apiUrl: environment.settings.apiUrl || 'http://localhost:3333',
      constellabApiUrl: environment.settings.constellabApiUrl || 'https://api.preconstellab.com',
      constellabFrontUrl: environment.settings.constellabFrontUrl || 'https://preconstellab.com',
      communityFrontUrl: environment.settings.communityFrontUrl || 'http://localhost:4200',
      captchaSiteKey: environment.settings.captchaSiteKey || null,
      googleAnalyticsId: environment.settings.googleAnalyticsId || 'eazeaze',
      discordLink: environment.settings.discordLink || 'https://discord.com/invite/7nmH5qKM',
      algoliaAppId: environment.settings.algoliaAppId || 'S233I3C24Z',
      algoliaSearchKey: environment.settings.algoliaSearchKey || '8fd4e2048efc6363ff0dca169b6522af',
      algoliaIndexName: environment.settings.algoliaIndexName || 'Community Preprod',
      algoliaSiteVerificationKey: environment.settings.algoliaSiteVerificationKey || null,
      homeVideoLink: environment.settings.homeVideoLink || null,
      ragflowChatId: environment.settings.ragflowChatId || '26505d6e028211f1a6b4fa8e0bdfc3da',
    };
    return environment;
  }

  public static isProduction(): boolean {
    return HaEnvironmentHelper.getEnv().production;
  }

  public static getApiUrl(): string {
    return HaEnvironmentHelper.getEnv().settings.apiUrl;
  }

  public static getConstellabFrontUrl(): string {
    return HaEnvironmentHelper.getEnv().settings.constellabFrontUrl;
  }

  public static getConstellabApiUrl(): string {
    return HaEnvironmentHelper.getEnv().settings.constellabApiUrl;
  }

  public static getCommunityFrontUrl(): string {
    return HaEnvironmentHelper.getEnv().settings.communityFrontUrl;
  }

  public static getRecaptchaSiteKey(): string {
    return HaEnvironmentHelper.getEnv().settings.captchaSiteKey;
  }

  public static getGoogleAnalyticsId(): string {
    return HaEnvironmentHelper.getEnv().settings.googleAnalyticsId;
  }

  public static getDiscordLink(): string {
    return HaEnvironmentHelper.getEnv().settings.discordLink;
  }

  public static getHomeVideoLink(): string | null {
    return HaEnvironmentHelper.getEnv().settings.homeVideoLink || null;
  }

  public static getRagflowChatId(): string | null {
    return HaEnvironmentHelper.getEnv().settings.ragflowChatId || null;
  }
}
