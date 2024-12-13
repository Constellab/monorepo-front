import { LmsEnvironment } from '../../environments/lms-environment.class';
import { environment } from '../../environments/lms-environment';

export class LmsEnvironmentHelper {
  public static getEnv(): LmsEnvironment {
    return environment;
  }

  public static isProduction(): boolean {
    return LmsEnvironmentHelper.getEnv().production;
  }

  public static getApiUrl(): string {
    return LmsEnvironmentHelper.getEnv().settings.apiUrl;
  }

  public static getCommunityFrontUrl(): string {
    return LmsEnvironmentHelper.getEnv().settings.communityFrontUrl;
  }

  public static getCommunityApiUrl(): string {
    return LmsEnvironmentHelper.getEnv().settings.communityApiUrl;
  }
}
