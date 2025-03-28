import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  labConstBaseRoute,
  labConstBioxFullRoute,
  labConstDocFullRoute,
  labConstMonitoringFullRoute,
  labConstNoteFullRoute,
  labConstNoteTemplateFullRoute,
  labConstResourceFullRoute,
  labConstScenarioTemplateFullRoute,
} from '../utils/li-base-route';

/**
 * Class to get app route paths
 */
@Injectable({
  providedIn: 'root',
})
export class LiRouterService {
  private router = inject(Router);

  ////// Static function to get routes  //////
  public static getAppRoute(): string {
    return `/${labConstBaseRoute}`;
  }

  public static getScenarioListRoute(): string {
    return labConstBioxFullRoute;
  }

  public static getDataboxRoute(): string {
    return labConstResourceFullRoute;
  }

  public static getScenarioDetailRoute(id: string): string {
    return `${labConstBioxFullRoute}/${id}`;
  }

  public static getScenarioTemplatesRoute(): string {
    return `${labConstScenarioTemplateFullRoute}`;
  }

  public static getScenarioTemplateDetailRoute(id: string): string {
    return `${labConstScenarioTemplateFullRoute}/${id}`;
  }

  public static getResourceDetailRoute(id: string): string {
    return `${labConstResourceFullRoute}/${id}`;
  }

  public static getViewConfigDetailRoute(
    resourceId: string,
    viewConfigId: string
  ): {
    route: string;
    queryParams: any;
  } {
    return {
      route: `${labConstResourceFullRoute}/${resourceId}`,
      queryParams: { viewId: viewConfigId },
    };
  }

  /**
   * Special route that get the resource id to redirect to the view config page
   * @param viewConfigId
   */
  public static getViewConfigRedirectRoute(viewConfigId: string): string {
    return `${labConstResourceFullRoute}/view-redirect/${viewConfigId}`;
  }

  public static getNoteSearchRoute(): string {
    return labConstNoteFullRoute;
  }

  public static getNoteDetailRoute(id: string): string {
    return `${labConstNoteFullRoute}/${id}`;
  }

  public static getNoteTemplateSearchRoute(): string {
    return labConstNoteTemplateFullRoute;
  }

  public static getNoteTemplateDetailRoute(id: string): string {
    return `${labConstNoteTemplateFullRoute}/${id}`;
  }

  public static getDocRoute(): string {
    return labConstDocFullRoute;
  }

  public static getTechnicalDocRoute(typingName: string): string {
    typingName = typingName.replaceAll('.', '-');
    return `${LiRouterService.getDocRoute()}/technical-doc/${typingName}`;
  }

  public static getLoginRoute(): string {
    return `/login`;
  }

  /////////////////// MONITORING ///////////////////
  public static getMonitoringRoute(): string {
    return labConstMonitoringFullRoute;
  }

  public static getMonitoringUsageRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/usage`;
  }

  public static getMonitoringTagsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/tags`;
  }

  public static getMonitoringVenvsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/virtual-envs`;
  }

  public static getMonitoringLogsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/logs`;
  }

  public static getMonitoringCredentialsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/credentials`;
  }

  public static getMonitoringActivityRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/activity`;
  }

  public static getOtherRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/other`;
  }

  /////////////////// NAVIGATE METHODS ///////////////////
  public navigateToAppRoute(): void {
    this.router.navigate([LiRouterService.getAppRoute()]);
  }

  public navigateToScenarioListRoute(): Promise<boolean> {
    return this.router.navigate([LiRouterService.getScenarioListRoute()]);
  }

  public navigateToDatabox(): Promise<boolean> {
    return this.router.navigate([LiRouterService.getDataboxRoute()]);
  }

  public navigateToScenarioDetail(id: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getScenarioDetailRoute(id)]);
  }

  public navigateToResourceDetail(id: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getResourceDetailRoute(id)]);
  }

  public navigateToScenarioTemplates(): Promise<boolean> {
    return this.router.navigate([LiRouterService.getScenarioTemplatesRoute()]);
  }

  public navigateToNoteDetail(id: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getNoteDetailRoute(id)]);
  }

  public navigateToNoteTemplateDetail(id: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getNoteTemplateDetailRoute(id)]);
  }

  public navigateToNoteSearch(): Promise<boolean> {
    return this.router.navigate([LiRouterService.getNoteSearchRoute()]);
  }

  public navigateToDocumentSearch(): Promise<boolean> {
    return this.router.navigate([LiRouterService.getNoteTemplateSearchRoute()]);
  }

  public navigateToViewConfig(resourceId: string, viewConfigId: string): Promise<boolean> {
    const viewRoute = LiRouterService.getViewConfigDetailRoute(resourceId, viewConfigId);
    return this.router.navigate([viewRoute.route], { queryParams: viewRoute.queryParams });
  }
}
