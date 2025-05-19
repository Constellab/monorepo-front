import { Injectable } from '@angular/core';
import { HaEnvironmentHelper } from '../ha-model/ha-config/ha-environment.helper';
import { HaAgentVersion } from '../ha-model/ha-entities/ha-agent-version.class';
import { ClBrick, ClStringHelper } from '@monorepo/core-lib';

@Injectable({
  providedIn: 'root',
})
export class HaRouterService {
  public static getAppUrl(): string {
    return HaEnvironmentHelper.getCommunityFrontUrl();
  }

  public static getFullRoute(route: string): string {
    return `${this.getAppUrl()}${route}`;
  }

  public static getHomeRoute(): string {
    return '/';
  }

  public static getBrickListRoute(): string {
    return '/bricks/';
  }

  public static getLoginRoute(): string {
    return '/login';
  }

  ////////////////////////// ADMIN ////////////////////////////////

  public static getAdminPanelRoute(): string {
    return '/admin';
  }

  public static getAdminPanelAgentsRoute(): string {
    return `${this.getAdminPanelRoute()}/agents`;
  }

  public static getAdminPanelAppsRoute(): string {
    return `${this.getAdminPanelRoute()}/apps`;
  }

  public static getAdminPanelBricksRoute(): string {
    return `${this.getAdminPanelRoute()}/bricks`;
  }

  public static getAdminPanelStoriesRoute(): string {
    return `${this.getAdminPanelRoute()}/stories`;
  }

  ////////////////////////// USEFUL ////////////////////////////////

  public static getProductDocRoute(): string {
    return `/bricks/${ClBrick.GWS_ACADEMY}/latest/doc/getting-started`;
  }

  public static getTechDocRoute(): string {
    return `/bricks/${ClBrick.GWS_CORE}/latest/doc/getting-started`;
  }

  public static getIconsRoute(): string {
    return '/icons';
  }

  public static getFairOpenAccessRoute(): string {
    return '/fair-open-access';
  }

  ////////////////////////// AGENTS ////////////////////////////////
  public static getAgentsListRoute(): string {
    return '/agents/';
  }

  public static getAgentRoute(id: string, titlePath: string): string {
    return `${this.getAgentsListRoute()}${id}/${titlePath}`;
  }

  public static getAgentVersionRoute(agentVersion: HaAgentVersion): string {
    return `${this.getAgentRoute(
      agentVersion.agent.id,
      ClStringHelper.getCleanUrlPath(agentVersion.agent.title)
    )}/version/${agentVersion.version}`;
  }

  ////////////////////////// STORIES ////////////////////////////////
  public static getStoriesListRoute(): string {
    return '/stories/';
  }

  public static getStoryRoute(id: string, titlePath: string): string {
    return `${this.getStoriesListRoute()}${id}/${titlePath}`;
  }

  public static getFullStoryRoute(id: string, titlePath: string): string {
    return `${this.getAppUrl()}${this.getStoryRoute(id, titlePath)}`;
  }

  public static getStoryEditRoute(id: string): string {
    return `${this.getStoriesListRoute()}edit/${id}`;
  }

  ////////////////////////// BRICKS ////////////////////////////////

  public static getBrickPageRoute(brickName: string, brickMajor?: string): string {
    const brickMajorUrl = brickMajor == null || brickMajor === 'latest' ? 'latest' : `v${brickMajor}`;
    return `${this.getBrickListRoute()}${brickName}/${brickMajorUrl}/`;
  }

  public static getBrickDocsPageRoute(brickName: string, brickMajor: string): string {
    return `${this.getBrickPageRoute(brickName, brickMajor)}doc/`;
  }

  public static getDocumentationRoute(
    brickName: string,
    brickMajor: string,
    completePath: string,
    id: string
  ): string {
    return `${this.getBrickDocsPageRoute(brickName, brickMajor)}${completePath}${id}`;
  }

  public static getTechnicalDocRoute(
    parentBrickName: string,
    parentVersion: string,
    objectType: string,
    docParentUniqueName: string
  ): string {
    return `${this.getBrickDocsPageRoute(
      parentBrickName,
      parentVersion
    )}technical-folder/${objectType}/${docParentUniqueName}`;
  }

  public static getBrickListVersionPageRoute(brickName: string, brickMajor: string): string {
    return `${this.getBrickPageRoute(brickName, brickMajor)}version/`;
  }

  ////////////////////////////// COMMUNITY APP ////////////////////////////////
  public static getCommunityAppListRoute(): string {
    return '/apps/';
  }

  public static getCommunityAppRoute(id: string, titlePath: string): string {
    return `${this.getCommunityAppListRoute()}${id}/${titlePath}`;
  }

  ///////////////////////////// PROFILE ////////////////////////////////
  public static getProfileRoute(): string {
    return '/profile/';
  }

  public static getUserProfileRoute(userId: string): string {
    return `${this.getProfileRoute()}${userId}`;
  }

  ///////////////////////////// TAGS //////////////////////////////////
  public static getTagsListRoute(): string {
    return '/tags/';
  }

  public static getTagPageRoute(id: string, technicalName: string): string {
    console.log('TAGSSS', id, technicalName);
    return `${this.getTagsListRoute()}${id}/${technicalName}`;
  }

  //////////////////////////// OTHERS ////////////////////////////////

  public static getGwsCoreRepoLink(): string {
    return 'https://github.com/Constellab/gws_core';
  }

  public static getDockerHubGlabLink(): string {
    return 'https://hub.docker.com/r/constellab/glab';
  }

  //////////////////////////// SHARE PAGE ////////////////////////////////
  public static getLinkedinShareUrl(url: string, title: string, description: string): string {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${description}`;
  }

  // --------------------------------------------------------------------------------------------

  //Check if the url is valid for community
  public static isAValidDocUrl(link: string): [boolean, boolean] {
    if (link.startsWith(this.getAppUrl())) {
      link = link.slice(this.getAppUrl().length);
      const url: string[] = link.split('/');
      return [
        url.length >= 5 && url[0] === 'bricks' && url[3] == 'doc' && url[4].length > 0,
        url[4] != 'technical-folder',
      ];
    }
    return [false, null];
  }
}
