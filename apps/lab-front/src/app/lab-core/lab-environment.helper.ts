import { ClHelpService } from '@monorepo/core-lib';
import { LabEnvironment } from '../../environments/lab-environment.class';
import { environment } from '../../environments/lab-environment';

/**
 * Static class to access environment
 *
 * The environment variable must always be access from here
 */
export class LabEnvironmentHelper {
  public static readonly coreApiRoute: string = 'core-api';

  public static getEnv(): LabEnvironment {
    return environment;
  }

  public static isProduction(): boolean {
    return LabEnvironmentHelper.getEnv().production;
  }

  public static getCoreApiUrl(): string {
    return `${LabEnvironmentHelper.getBaseApiUrl()}/${LabEnvironmentHelper.coreApiRoute}/`;
  }

  public static getCodelabUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.codelabUrl;
  }

  // return the full URL for the codelab with direct link to open the right folder
  public static getCodelabFullUrl(): string {
    // eslint-disable-next-line max-len
    return `${LabEnvironmentHelper.getCodelabUrl()}/?folder=/lab/user`;
  }

  public static getBaseApiUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.apiBaseUrl;
  }

  public static getDevBaseApiUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.devApiBaseUrl;
  }

  public static getDevCoreApiUrl(): string {
    return `${LabEnvironmentHelper.getDevBaseApiUrl()}/${LabEnvironmentHelper.coreApiRoute}/`;
  }

  public static getRecaptchaSiteKey(): string {
    return LabEnvironmentHelper.getEnv().settings.captchaSiteKey;
  }

  public static getProdFrontUrls(): string[] {
    const prodUrls = LabEnvironmentHelper.getEnv().settings.prodFrontUrls;
    if (ClHelpService.isNullOrEmpty(prodUrls)) {
      return [];
    }
    return prodUrls.split(',');
  }

  public static getDevFrontUrls(): string[] {
    const devUrls = LabEnvironmentHelper.getEnv().settings.devFrontUrls;
    if (ClHelpService.isNullOrEmpty(devUrls)) {
      return [];
    }
    return devUrls.split(',');
  }

  //////////////////////////// Space ////////////////////////////
  public static getSpaceFrontUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.spaceFrontUrl;
  }

  public static getSpaceApiUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.spaceApiUrl;
  }

  public static getSpaceFrontAppUrl(): string {
    return LabEnvironmentHelper.getSpaceFrontUrl() + '/app';
  }

  public static getSpaceDashboardLabUrl(labId: string): string {
    return `${LabEnvironmentHelper.getSpaceFrontAppUrl()}/labs/${labId}`;
  }

  public static getSpaceConfigLabUrl(labId: string): string {
    return `${LabEnvironmentHelper.getSpaceFrontAppUrl()}/labs/${labId}/config`;
  }

  ////////////////////// Community //////////////////////
  public static getCommunityFrontUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.communityFrontUrl;
  }

  public static getCommunityApiUrl(): string {
    return LabEnvironmentHelper.getEnv().settings.communityApiUrl;
  }

  public static getConstellabPublicUrl(): string {
    return 'https://gencovery.com/constellab';
  }
}
