import {LabEnvironmentHelper} from './lab-environment.helper';
import {TdTypingName} from '@monorepo/technical-doc';

export type LabBrickVersionPath = 'latest' | string;

/**
 * Class to get url of the hub
 */
export class LabCommunityHelper {

  public static GWS_CORE_BRICK_NAME = 'gws_core';
  public static GWS_ACADEMY_BRICK_NAME = 'gws_academy';


  ///////////////////////// FRONT //////////////////////////

  public static getCommunityUrl(): string {
    return LabEnvironmentHelper.getCommunityFrontUrl();
  }

  public static getBrickUrl(brickName: string, version: LabBrickVersionPath): string {
    const majorString = version === 'latest' ? 'latest' : 'v' + version.split('.')[0];
    return `${this.getCommunityUrl()}/bricks/${brickName}/${majorString}`;
  }

  public static getTechnicalDocUrl(typingName: TdTypingName, version: LabBrickVersionPath): string {
    // eslint-disable-next-line max-len
    return `${this.getBrickUrl(typingName.brickName, version)}/doc/technical-folder/${typingName.type.toLowerCase()}/${typingName.uniqueName}`;
  }

  public static getDocUrl(brickName: string, version: LabBrickVersionPath, docPath: string, anchor?: string): string {
    let docUrl = `${this.getBrickUrl(brickName, version)}/doc/${docPath}`;
    if (anchor) {
      docUrl += '#' + anchor;
    }
    return docUrl;
  }


  /////////////////////////////////// SPECIFIC ROUTES //////////////////////////////////////

  public static getImportResourceDocUrl(): string {
    return LabCommunityHelper.getDocUrl(LabCommunityHelper.GWS_ACADEMY_BRICK_NAME, 'latest',
      'digital-lab/digital-resource', 'how-to-import-a-resource?');
  }


}
