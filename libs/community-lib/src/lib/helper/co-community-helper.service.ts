import { TdBrick, TdTypingName } from '@monorepo/technical-doc';
import { CoConfig } from '../service/co-service-config.config';
import { Injectable, inject } from '@angular/core';

export type CoBrickVersionPath = 'latest' | string;

/**
 * Class to get url of the hub
 */
@Injectable({
  providedIn: 'root',
})
export class CoCommunityHelperService {
  private config = inject(CoConfig);

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

  public getAgentVersionUrl(agentId: string, title: string, versionNum: string): string {
    return `${this.getCommunityUrl()}/agents/${agentId}/${title}/version/${versionNum}`;
  }

  /////////////////////////////////// SPECIFIC ROUTES //////////////////////////////////////

  public getDataLabOverviewRoute(): string {
    return this.getDocUrl(
      TdBrick.GWS_ACADEMY,
      'latest',
      'digital-lab/overview/294e86b4-ce9a-4c56-b34e-61c9a9a8260d'
    );
  }

  public getDataLabManagementRoute(): string {
    return this.getDocUrl(
      TdBrick.GWS_ACADEMY,
      'latest',
      'digital-lab/on-cloud-digital-lab-management/4ab03b1f-a96d-4d7a-a733-ad1edf4fb53c'
    );
  }

  public getDesktopDocUrl(): string {
    return this.getDocUrl(
      TdBrick.GWS_ACADEMY,
      'latest',
      'digital-lab/digital-lab-for-desktop/700a88e8-da5c-4e97-b6eb-86e1b26f73e4'
    );
  }

  public getDevEnvironmentUrl(): string {
    return this.getDocUrl(
      TdBrick.GWS_CORE,
      'latest',
      'developer-guide/dev-environment/getting-started/811dd5e9-e703-466d-bd99-c7c7f713a74e'
    );
  }

  public getImportResourceDocUrl(): string {
    return this.getDocUrl(
      TdBrick.GWS_ACADEMY,
      'latest',
      'digital-lab/digital-resource/51b1f255-e08f-41f6-b503-10e37ea277b0',
      'how-to-import-a-resource?'
    );
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
    return this.getCommunityApiUrl() + '/public/icon/file';
  }
}
