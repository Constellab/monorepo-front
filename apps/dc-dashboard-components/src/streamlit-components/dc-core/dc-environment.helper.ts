import { DcEnvironment } from '../dc-environment/dc-environment.class';
import { environment } from '../dc-environment/dc-environment';

/**
 * Static class to access environment
 *
 * The environment variable must always be access from here
 */
export class DcEnvironmentHelper {
  public static readonly coreApiRoute: string = 'core-api';

  public static getEnv(): DcEnvironment {
    return environment;
  }

  public static isProduction(): boolean {
    return DcEnvironmentHelper.getEnv().production;
  }

  public static getBaseApiUrl(): string {
    return DcEnvironmentHelper.getEnv().settings.apiBaseUrl;
  }

  public static getCoreApiUrl(): string {
    return `${DcEnvironmentHelper.getBaseApiUrl()}/${DcEnvironmentHelper.coreApiRoute}/`;
  }

  public static getSpaceApiUrl(): string {
    return DcEnvironmentHelper.getEnv().settings.spaceApiUrl;
  }

  public static getSpaceFrontAppUrl(): string {
    return DcEnvironmentHelper.getEnv().settings.spaceFrontUrl + '/app';
  }

  public static getSpaceDashboardLabUrl(labId: string): string {
    return `${DcEnvironmentHelper.getSpaceFrontAppUrl()}/labs/${labId}`;
  }

  ////////////////////// Community //////////////////////
  public static getCommunityFrontUrl(): string {
    return DcEnvironmentHelper.getEnv().settings.communityFrontUrl;
  }

  public static getCommunityApiUrl(): string {
    return DcEnvironmentHelper.getEnv().settings.communityApiUrl;
  }
}
