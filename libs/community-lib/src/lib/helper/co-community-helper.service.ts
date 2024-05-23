import {TdBrick, TdTypingName} from '@monorepo/technical-doc';
import {CoConfig} from '../service/co-service-config.config';
import {Injectable} from '@angular/core';


export type CoBrickVersionPath = 'latest' | string;

/**
 * Class to get url of the hub
 */
@Injectable({
  providedIn: 'root'
})
export class CoCommunityHelperService {

  constructor(private config: CoConfig) {

  }
  ///////////////////////// FRONT //////////////////////////

  public getCommunityUrl(): string {
    return this.config.getCommunityFrontUrl();
  }

  public getBrickUrl(brickName: string, version: CoBrickVersionPath): string {
    const majorString = version === 'latest' ? 'latest' : 'v' + version.split('.')[0];
    return `${this.getCommunityUrl()}/bricks/${brickName}/${majorString}`;
  }

  public getTechnicalDocUrl(typingName: TdTypingName, version: CoBrickVersionPath): string {
    // eslint-disable-next-line max-len
    return `${this.getBrickUrl(typingName.brickName, version)}/doc/technical-folder/${typingName.type.toLowerCase()}/${typingName.uniqueName}`;
  }

  public getDocUrl(brickName: string, version: CoBrickVersionPath, docPath: string, anchor?: string): string {
    let docUrl = `${this.getBrickUrl(brickName, version)}/doc/${docPath}`;
    if (anchor) {
      docUrl += '#' + anchor;
    }
    return docUrl;
  }

  public getTaskUrl(brickName: string, taskUniqueName: string): string {
    return `${this.getCommunityUrl()}/bricks/${brickName}/latest/doc/technical-folder/task/${taskUniqueName}`;
  }

  public getLiveTasKVersionUrl(liveTaskId: string, versionId: string): string {
    return `${this.getCommunityUrl()}/live-tasks/${liveTaskId}/versions/${versionId}`;
  }

  /////////////////////////////////// SPECIFIC ROUTES //////////////////////////////////////

  public getDigitalLabOverviewRoute(): string{
    return this.getDocUrl(TdBrick.GWS_ACADEMY, 'latest', 'digital-lab/overview')
  }

  public getDesktopDocUrl(): string {
    return this.getDocUrl(TdBrick.GWS_ACADEMY, 'latest', 'digital-lab/digital-lab-for-desktop')
  }

  public getDevEnvironmentUrl(): string {
    return this.getDocUrl(TdBrick.GWS_CORE, 'latest', 'developer-guide/dev-environment/getting-started')
  }

  public getImportResourceDocUrl(): string {
    return this.getDocUrl(TdBrick.GWS_ACADEMY, 'latest',
      'digital-lab/digital-resource', 'how-to-import-a-resource?');
  }

  ///////////////////////// API //////////////////////////

  public getCommunityApiUrl(): string {
    return this.config.getCommunityApiUrl();
  }

  public getTaskOfTheDayApiUrl(): string {
    return this.getCommunityApiUrl() + '/task/task-of-the-day';
  }

  public getTechnicalDocByPathApiUrl(): string {
    return this.getCommunityApiUrl() + '/brick/technical-doc-by-path';
  }

  public getIconBaseApiUrl(): string {
    return this.getCommunityUrl() + '/public/icon/file';
  }
}
