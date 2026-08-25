import { HA_ENVIRONMENT } from '../../../../environments/ha-environment';
import { HaEnvironment } from '../../../../environments/ha-environment.class';

/**
 * Centralized access to environment configuration.
 *
 * Settings are loaded at bootstrap from assets/settings.json (production) or hardcoded
 * defaults (development) — see main.ts for the loading logic.
 * Each getter provides a fallback default so the app works locally without a settings file.
 */
export class HaEnvironmentHelper {
  public static getEnv(): HaEnvironment {
    HA_ENVIRONMENT.settings = {
      apiUrl: HA_ENVIRONMENT.settings.apiUrl || 'http://localhost:3333',
      constellabApiUrl: HA_ENVIRONMENT.settings.constellabApiUrl || 'https://api.preconstellab.com',
      constellabFrontUrl: HA_ENVIRONMENT.settings.constellabFrontUrl || 'https://preconstellab.com',
      communityFrontUrl: HA_ENVIRONMENT.settings.communityFrontUrl || 'http://localhost:4200',
      captchaSiteKey: HA_ENVIRONMENT.settings.captchaSiteKey || '',
      googleAnalyticsId: HA_ENVIRONMENT.settings.googleAnalyticsId || 'eazeaze',
      discordLink: HA_ENVIRONMENT.settings.discordLink || 'https://discord.com/invite/7nmH5qKM',
      algoliaAppId: HA_ENVIRONMENT.settings.algoliaAppId || 'S233I3C24Z',
      algoliaSearchKey: HA_ENVIRONMENT.settings.algoliaSearchKey || '8fd4e2048efc6363ff0dca169b6522af',
      algoliaIndexName: HA_ENVIRONMENT.settings.algoliaIndexName || 'Community Preprod',
      algoliaSiteVerificationKey: HA_ENVIRONMENT.settings.algoliaSiteVerificationKey || null,
      homeVideoLink: HA_ENVIRONMENT.settings.homeVideoLink || null,
    };
    return HA_ENVIRONMENT;
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
}
