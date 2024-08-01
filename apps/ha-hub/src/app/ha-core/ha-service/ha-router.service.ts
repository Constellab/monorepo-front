import {Injectable} from '@angular/core';
import {HaEnvironmentHelper} from '../ha-model/ha-config/ha-environment.helper';
import {HaLiveTaskVersion} from '../ha-model/ha-entities/ha-live-task-version.class';
import {ClStringHelper} from '@monorepo/core-lib';
import {TdBrick} from '@monorepo/technical-doc';

@Injectable({
  providedIn: 'root'
})
export class HaRouterService {

  public static getAppUrl(): string {
    return HaEnvironmentHelper.getCommunityFrontUrl();
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

  public static getAdminRoute(): string {
    return '/admin';
  }

  public static getProductDocRoute(): string {
    return `/bricks/${TdBrick.GWS_ACADEMY}/latest/doc/getting-started`;
  }

  public static getTechDocRoute(): string {
    return `/bricks/${TdBrick.GWS_CORE}/latest/doc/getting-started`;
  }

  public static getIconsRoute(): string {
    return '/icons';
  }

  ////////////////////////// LIVE TASKS ////////////////////////////////
  public static getLiveTaskListRoute(): string {
    return '/live-tasks/';
  }

  public static getLiveTaskRoute(id: string, titlePath: string): string {
    return `${this.getLiveTaskListRoute()}${id}/${titlePath}`;
  }

  public static getLiveTaskVersionRoute(liveTaskVersion: HaLiveTaskVersion): string{
    return `${this.getLiveTaskRoute(liveTaskVersion.liveTask.id,
      ClStringHelper.getCleanUrlPath(liveTaskVersion.liveTask.title))}/version/${liveTaskVersion.version}`;
  }

  ////////////////////////// STORIES ////////////////////////////////
  public static getStoriesListRoute(): string {
    return '/stories/';
  }

  public static getStoryRoute(id: string, titlePath: string): string {
    return `${this.getStoriesListRoute()}${id}/${titlePath}`;
  }
  ////////////////////////// BRICKS ////////////////////////////////

  public static getBrickPageRoute(brickName: string, brickMajor?: string): string {
    const brickMajorUrl = brickMajor == null || brickMajor === 'latest' ? 'latest' : `v${brickMajor}`;
    return `${this.getBrickListRoute()}${brickName}/${brickMajorUrl}/`;
  }

  public static getBrickDocsPageRoute(brickName: string, brickMajor: string): string {
    return `${this.getBrickPageRoute(brickName, brickMajor)}doc/`;
  }

  public static getDocumentationRoute(brickName: string, brickMajor: string, completePath: string, id: string): string {
    return `${this.getBrickDocsPageRoute(brickName, brickMajor)}${completePath}${id}`;
  }

  public static getTechnicalDocRoute(parentBrickName: string, parentVersion: string,
                                     objectType: string, docParentUniqueName: string): string {
    return `${this.getBrickDocsPageRoute(parentBrickName, parentVersion)}technical-folder/${objectType}/${docParentUniqueName}`;
  }

  public static getBrickListVersionPageRoute(brickName: string, brickMajor: string): string {
    return `${this.getBrickPageRoute(brickName, brickMajor)}version/`;
  }

  ///////////////////////////// PROFILE ////////////////////////////////
  public static getProfileRoute(): string{
    return '/profile/';
  }



  //////////////////////////// OTHERS ////////////////////////////////
  public static getDiscordLink(): string {
    return 'https://discord.gg/nuEyj8yR';
  }

  public static getGwsCoreRepoLink(): string {
    return 'https://github.com/Constellab/gws_core';
  }

  // --------------------------------------------------------------------------------------------

  //Check if the url is valid for the hub
  public static isAValidDocUrl(link: string): [boolean, boolean] {
    if (link.startsWith(this.getAppUrl())) {
      link = link.slice(this.getAppUrl().length);
      const url: string[] = link.split('/');
      return [url.length >= 5 && url[0] === 'bricks' && url[3] == 'doc' && url[4].length > 0, url[4] != 'technical-folder'];
    }
    return [false, null];
  }

}
