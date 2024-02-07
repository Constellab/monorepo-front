import {HaEnvironment} from '../../../../environments/ha-environment.class';
import {environment} from '../../../../environments/ha-environment';


export class HaEnvironmentHelper{

  public static getEnv(): HaEnvironment {
    //TODO: FIX THIS
    environment.settings = {
      apiUrl: environment.settings.apiUrl || process.env['API_URL'] || 'http://localhost:3333',
      constellabApiUrl: environment.settings.constellabApiUrl ||  process.env['CONSTELLAB_API_URL'] || 'https://api.preconstellab.com',
      constellabFrontUrl: environment.settings.constellabFrontUrl ||  process.env['CONSTELLAB_FRONT_URL'] || 'https://preconstellab.com',
      communityFrontUrl: environment.settings.communityFrontUrl || process.env['COMMUNITY_FRONT_URL'] || 'http://localhost:4200',
      captchaSiteKey: environment.settings.captchaSiteKey || process.env['CAPTCHA_SITE_KEY'] || '123465',
      googleAnalyticsId: environment.settings.googleAnalyticsId || process.env['GOOGLE_ANALYTICS_ID'] || 'eazeaze',
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
}
