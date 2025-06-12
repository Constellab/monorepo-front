import { environment } from '../../../environments/ca-environment';
import { CaEnvironment } from '../../../environments/ca-environment.class';

export class CaEnvironmentHelper {
  public static getEnv(): CaEnvironment {
    return environment;
  }

  public static isProduction(): boolean {
    return CaEnvironmentHelper.getEnv().production;
  }

  public static getApiUrl(): string {
    return CaEnvironmentHelper.getEnv().settings.apiUrl;
  }

  public static getCommunityFrontUrl(): string {
    return CaEnvironmentHelper.getEnv().settings.communityFrontUrl;
  }

  public static getCommunityApiUrl(): string {
    return CaEnvironmentHelper.getEnv().settings.communityApiUrl;
  }

  public static getFrontDomain(): string {
    return CaEnvironmentHelper.getEnv().settings.frontDomain;
  }

  public static getRecaptchaSiteKey(): string {
    return CaEnvironmentHelper.getEnv().settings.captchaSiteKey;
  }

  public static getDifyChatbotToken(): string | null {
    return CaEnvironmentHelper.getEnv().settings.difyChatbotToken;
  }

  public static getSupportMail(): string {
    return 'clientsuccess@gencovery.com';
  }

  public static getContactUsPageUrl(): string {
    return 'https://www.gencovery.com/contact-us';
  }
}
