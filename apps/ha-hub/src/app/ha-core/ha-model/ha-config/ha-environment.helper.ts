import { HaEnvironment } from '../../../../environments/ha-environment.class';
import { environment } from '../../../../environments/ha-environment';

export class HaEnvironmentHelper {
  public static getEnv(): HaEnvironment {
    environment.settings = {
      apiUrl: environment.settings.apiUrl || 'http://localhost:3333',
      constellabApiUrl: environment.settings.constellabApiUrl || 'https://api.preconstellab.com',
      constellabFrontUrl: environment.settings.constellabFrontUrl || 'https://preconstellab.com',
      communityFrontUrl: environment.settings.communityFrontUrl || 'http://localhost:4200',
      captchaSiteKey: environment.settings.captchaSiteKey || '123465',
      googleAnalyticsId: environment.settings.googleAnalyticsId || 'eazeaze',
      discordLink: environment.settings.discordLink || 'https://discord.com/invite/7nmH5qKM',
      algoliaAppId: environment.settings.algoliaAppId || 'S233I3C24Z',
      algoliaSearchKey: environment.settings.algoliaSearchKey || '8fd4e2048efc6363ff0dca169b6522af',
      algoliaSiteVerificationKey: environment.settings.algoliaSiteVerificationKey || null,
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
}
