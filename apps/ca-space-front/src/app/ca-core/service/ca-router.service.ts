import { inject, Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

import {
  caConstAdminRoute,
  caConstBaseRoute,
  caConstChatRoute,
  caConstFolderRoute,
  caConstHomeRoute,
  caConstLabsRoute,
  caConstStructureRoute,
  caConstUserPageRoute,
} from '../utils/ca-base-route';
import { CaEnvironmentHelper } from '../utils/ca-environment.helper';

 
/**
 * Class to get app route paths
 */
@Injectable({ providedIn: 'root' })
export class CaRouterService {
  private router = inject(Router);

  public navigate(route: string, extras?: NavigationExtras): void {
    this.router.navigate([route], extras);
  }

  //////////////////////////////////// ROUTES OUTSIDE /APP ///////////////////////////////////////

  public static getLoginRoute(): string {
    return `/login`;
  }

  public static getSignupRoute(): string {
    return `/signup`;
  }

  public navigatorToLoginRoute(): void {
    this.router.navigate([CaRouterService.getLoginRoute()]);
  }

  public static getNoSpaceRoute(): string {
    return `/no-space`;
  }

  //////////////////////////////////// ROUTES IN /APP ///////////////////////////////////////
  public static getAppRoute(): string {
    return `/${caConstBaseRoute}`;
  }

  public static getHomeRoute(): string {
    return CaRouterService.getFullRoute(caConstHomeRoute);
  }

  public navigateToDashboard(): void {
    this.router.navigate([CaRouterService.getHomeRoute()]);
  }

  //////////////////////////// FOLDER //////////////////////////////

  public static getFolderDetailRoute(folderId: string): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/${folderId}`);
  }

  public navigateToFolderDetail(folderId: string): void {
    this.router.navigate([CaRouterService.getFolderDetailRoute(folderId)]);
  }

  public static getFolderAllSearchRoute(): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/all/search`);
  }

  public navigateToFolderSearch(): Promise<any> {
    return this.router.navigate([CaRouterService.getFolderAllSearchRoute()]);
  }

  public static getMyFoldersRoute(): string {
    return CaRouterService.getFullRoute(caConstFolderRoute);
  }

  public static getScenarioDetailRoute(scenarioId: string): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/scenario/${scenarioId}`);
  }

  public static getNoteDetailRoute(noteId: string): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/note/${noteId}`);
  }

  public static getDocumentDetailRoute(documentId: string): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/document/${documentId}`);
  }

  public static getDocumentPreviewRoute(documentId: string): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/document/${documentId}/preview`);
  }

  public static getFolderActivityRoute(folderId: string): string {
    return `${CaRouterService.getFolderDetailRoute(folderId)}/activity`;
  }

  public static getResourceDetailRoute(resourceId: string): string {
    return CaRouterService.getFullRoute(`${caConstFolderRoute}/resource/${resourceId}`);
  }

  public navigateToDocumentDetail(documentId: string): void {
    this.router.navigate([CaRouterService.getDocumentDetailRoute(documentId)]);
  }

  public navigateToDocumentPreview(documentId: string): void {
    this.router.navigate([CaRouterService.getDocumentPreviewRoute(documentId)]);
  }

  //////////////////////////// Lab //////////////////////////////

  public static getMyLabsRoute(): string {
    return CaRouterService.getFullRoute(caConstLabsRoute);
  }

  public static getLabDetailRoute(labId: string): string {
    return CaRouterService.getFullRoute(`${caConstLabsRoute}/${labId}`);
  }

  public navigateToLabDetail(labId: string): void {
    this.router.navigate([CaRouterService.getLabDetailRoute(labId)]);
  }

  public static getLabConfigRoute(labId: string): string {
    return `${CaRouterService.getLabDetailRoute(labId)}/config`;
  }

  public static getLabStatusHistoryRoute(labId: string): string {
    return `${CaRouterService.getLabDetailRoute(labId)}/status-history`;
  }

  public static getLabUsageRoute(labId: string): string {
    return `${CaRouterService.getLabDetailRoute(labId)}/usage`;
  }

  public static getLabBackupRoute(labId: string): string {
    return `${CaRouterService.getLabDetailRoute(labId)}/backup`;
  }

  public static getLabSupportRoute(labId: string): string {
    return `${CaRouterService.getLabDetailRoute(labId)}/support`;
  }

  public static getCreateLabRoute(): string {
    return CaRouterService.getFullRoute(`${caConstLabsRoute}/create`);
  }

  public navigateToLabConfigRoute(labId: string): void {
    this.router.navigate([CaRouterService.getLabConfigRoute(labId)]);
  }

  ////////////////////////// STRUCTURE MODULE ///////////////////////

  public static getTeamRoute(teamId: string): string {
    return CaRouterService.getFullRoute(`${caConstStructureRoute}/team/${teamId}`);
  }

  public static getMyTeamsRoute(): string {
    return CaRouterService.getFullRoute(`${caConstStructureRoute}/my-teams`);
  }

  public navigateToMyTeams(): void {
    this.router.navigate([CaRouterService.getMyTeamsRoute()]);
  }

  public static getMyAppsRoute(): string {
    return CaRouterService.getFullRoute(`${caConstStructureRoute}/my-apps`);
  }

  public navigateToMyApps(): void {
    this.router.navigate([CaRouterService.getMyAppsRoute()]);
  }

  public navigateToTeam(teamId: string): void {
    this.router.navigate([CaRouterService.getTeamRoute(teamId)]);
  }

  ////////////////////////////// CURRENT SPACE ///////////////////////////
  public static getCurrentSpaceRoute(): string {
    return CaRouterService.getFullRoute(`${caConstStructureRoute}/current-space`);
  }

  public static getCurrentSpaceUsersRoute(): string {
    return `${CaRouterService.getCurrentSpaceRoute()}/users`;
  }

  public static getCurrentSpaceLabsRoute(): string {
    return `${CaRouterService.getCurrentSpaceRoute()}/labs`;
  }

  public static getCurrentSpaceFoldersRoute(): string {
    return `${CaRouterService.getCurrentSpaceRoute()}/folders`;
  }

  public static getCurrentSpaceTeamsRoute(): string {
    return `${CaRouterService.getCurrentSpaceRoute()}/teams`;
  }

  public static getCurrentSpaceOtherRoute(): string {
    return `${CaRouterService.getCurrentSpaceRoute()}/other`;
  }

  ////////////////////////// CHAT ///////////////////////

  public static getChatRoute(): string {
    return CaRouterService.getFullRoute(caConstChatRoute);
  }

  public static getChatFolderRoute(folderId: string): string {
    return `${CaRouterService.getChatRoute()}/folder/${folderId}`;
  }

  public navigateToChatFolder(folderId: string, extras?: NavigationExtras): void {
    this.router.navigate([CaRouterService.getChatFolderRoute(folderId)], extras);
  }

  ////////////////////////// ADMIN ///////////////////////

  public static getAdminRoute(): string {
    return CaRouterService.getFullRoute(caConstAdminRoute);
  }

  public static getAdminSpacesRoute(): string {
    return `${CaRouterService.getAdminRoute()}/spaces`;
  }

  public static getAdminUsersRoute(): string {
    return `${CaRouterService.getAdminRoute()}/users`;
  }

  public static getAdminLabsRoute(): string {
    return `${CaRouterService.getAdminRoute()}/labs`;
  }

  public static getAdminServersRoute(): string {
    return `${CaRouterService.getAdminRoute()}/servers`;
  }

  public static getAdminBucketsRoute(): string {
    return `${CaRouterService.getAdminRoute()}/buckets`;
  }

  public static getAdminServersInfoRoute(): string {
    return `${CaRouterService.getAdminRoute()}/servers-info`;
  }

  public static getAdminMailsRoute(): string {
    return `${CaRouterService.getAdminRoute()}/mails`;
  }

  public navigateToAdmin(): void {
    this.router.navigate([CaRouterService.getAdminRoute()]);
  }

  ////////////////////////// SETTINGS ///////////////////////
  public static getUserDetailRoute(userId: string): string {
    return CaRouterService.getFullRoute(caConstUserPageRoute + '/' + userId);
  }

  private static getFullRoute(route: string): string {
    return `/${caConstBaseRoute}/${route}`;
  }

  ////////////////////////// OTHER SPACE URLS ///////////////////////

  public static getSpaceDomainBaseUrl(spaceDomain: string): string {
    if (CaEnvironmentHelper.isProduction()) {
      return `https://${spaceDomain}.${CaEnvironmentHelper.getFrontDomain()}`;
    } else {
      return `http://${CaEnvironmentHelper.getFrontDomain()}:4200`;
    }
  }

  public static getSpaceDomainUrl(spaceDomain: string, fullRoute: string): string {
    return `${CaRouterService.getSpaceDomainBaseUrl(spaceDomain)}${fullRoute}`;
  }

  public navigateToExternalSpaceRoute(spaceDomain: string, route: string): void {
    window.location.href = CaRouterService.getSpaceDomainUrl(spaceDomain, route);
  }
}
