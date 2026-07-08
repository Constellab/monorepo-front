import { LMS_ENVIRONMENT } from '../../environments/lms-environment';
import { LmsEnvironment } from '../../environments/lms-environment.class';

export class LmsEnvironmentHelper {
  public static getEnv(): LmsEnvironment {
    return LMS_ENVIRONMENT;
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
