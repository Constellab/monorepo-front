import { HA_ENVIRONMENT } from '../../../../environments/ha-environment';
import { HaEnvironment, HaEnvironmentSettings } from '../../../../environments/ha-environment.class';

/**
 * Centralized access to environment configuration.
 *
 * Settings are loaded at bootstrap from assets/settings.json (production) or hardcoded
 * defaults (development) — see main.ts for the loading logic.
 * Each setting falls back to a default so the app works locally without a settings file.
 */
export class HaEnvironmentHelper {
  /**
   * Fallback used for every setting the loaded settings file leaves empty.
   */
  private static readonly DEFAULT_SETTINGS: HaEnvironmentSettings = {
    apiUrl: 'http://localhost:3333',
    constellabApiUrl: 'https://api.preconstellab.com',
    constellabFrontUrl: 'https://preconstellab.com',
    communityFrontUrl: 'http://localhost:4200',
    captchaSiteKey: '',
    googleAnalyticsId: 'eazeaze',
    discordLink: 'https://discord.com/invite/7nmH5qKM',
    algoliaAppId: 'S233I3C24Z',
    algoliaSearchKey: '8fd4e2048efc6363ff0dca169b6522af',
    algoliaIndexName: 'Community Preprod',
    algoliaSiteVerificationKey: null,
    homeVideoLink: null,
  };

  public static getEnv(): HaEnvironment {
    HA_ENVIRONMENT.settings = HaEnvironmentHelper.withDefaults(HA_ENVIRONMENT.settings);
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

  /**
   * Start from the defaults and let every value actually provided by the settings file win.
   * Equivalent to `loaded || default` on each key, without one branch per setting.
   */
  private static withDefaults(settings: HaEnvironmentSettings): HaEnvironmentSettings {
    const resolved: HaEnvironmentSettings = { ...HaEnvironmentHelper.DEFAULT_SETTINGS };
    for (const key of Object.keys(resolved) as (keyof HaEnvironmentSettings)[]) {
      const value = settings[key];
      if (value) resolved[key] = value;
    }
    return resolved;
  }
}
