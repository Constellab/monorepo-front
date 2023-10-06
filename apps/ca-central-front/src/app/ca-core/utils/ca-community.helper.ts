import {CaEnvironmentHelper} from './ca-environment.helper';
import {TdTypingName} from '@monorepo/technical-doc';

export type CaBrickVersionPath = 'latest' | string;

/**
 * Class to get url of the hub
 */
export class CaCommunityHelper {

  public static GWS_CORE_BRICK_NAME = 'gws_core';
  public static GWS_ACADEMY_BRICK_NAME = 'gws_academy';


  ///////////////////////// FRONT //////////////////////////

  public static getCommunityUrl(): string {
    return CaEnvironmentHelper.getCommunityFrontUrl();
  }

  public static getBrickUrl(brickName: string, version: CaBrickVersionPath): string {
    const majorString = version === 'latest' ? 'latest' : 'v' + version.split('.')[0];
    return `${this.getCommunityUrl()}/bricks/${brickName}/${majorString}`;
  }

  public static getTechnicalDocUrl(brickName: string, version: CaBrickVersionPath, typingName: TdTypingName): string {
    return `${this.getBrickUrl(brickName, version)}/doc/technical-folder/${typingName.type.toLowerCase()}/${typingName.uniqueName}`;
  }

  public static getDocUrl(brickName: string, version: CaBrickVersionPath, docPath: string): string {
    return `${this.getBrickUrl(brickName, version)}/doc/${docPath}`;
  }

  public static getTaskUrl(brickName: string, taskUniqueName: string): string {
    return `${this.getCommunityUrl()}/bricks/${brickName}/latest/doc/technical-folder/task/${taskUniqueName}`;
  }

  /////////////////////////////////// SPECIFIC ROUTES //////////////////////////////////////

  public static getDigitalLabOverviewRoute(): string{
    return CaCommunityHelper.getDocUrl(CaCommunityHelper.GWS_ACADEMY_BRICK_NAME, 'latest', 'digital-lab/overview')
  }

  public static getDesktopDocUrl(): string {
    return CaCommunityHelper.getDocUrl(CaCommunityHelper.GWS_CORE_BRICK_NAME, 'latest', 'digital-lab/digital-lab-for-desktop')
  }

  public static getDevEnvironmentUrl(): string {
    return CaCommunityHelper.getDocUrl(CaCommunityHelper.GWS_CORE_BRICK_NAME, 'latest', 'developer-guide/dev-environment/getting-started')
  }


  ///////////////////////// API //////////////////////////

  public static getCommunityApiUrl(): string {
    return CaEnvironmentHelper.getCommunityApiUrl();
  }

  public static getTaskOfTheDayApiUrl(): string {
    return this.getCommunityApiUrl() + '/task/task-of-the-day';
  }

  public static getTechnicalDocByPathApiUrl(): string {
    return this.getCommunityApiUrl() + '/brick/technical-doc-by-path';
  }
}
