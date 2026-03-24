import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  liConstBaseRoute,
  liConstDocFullRoute,
  liConstMonitoringFullRoute,
  liConstNoteFullRoute,
  liConstNoteTemplateFullRoute,
  liConstResourceFullRoute,
  liConstScenarioFullRoute,
  liConstScenarioTemplateFullRoute,
  liConstTagFullRoute,
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
    return `/${liConstBaseRoute}`;
  }

  public static getScenarioListRoute(): string {
    return liConstScenarioFullRoute;
  }

  public static getDataboxRoute(): string {
    return liConstResourceFullRoute;
  }

  public static getScenarioDetailRoute(id: string): string {
    return `${liConstScenarioFullRoute}/${id}`;
  }

  public static getScenarioTemplatesRoute(): string {
    return `${liConstScenarioTemplateFullRoute}`;
  }

  public static getScenarioTemplateDetailRoute(id: string): string {
    return `${liConstScenarioTemplateFullRoute}/${id}`;
  }

  public static getResourceDetailRoute(id: string): string {
    return `${liConstResourceFullRoute}/${id}`;
  }

  public static getViewConfigDetailRoute(
    resourceId: string,
    viewConfigId: string
  ): {
    route: string;
    queryParams: any;
  } {
    return {
      route: `${liConstResourceFullRoute}/${resourceId}`,
      queryParams: { viewId: viewConfigId },
    };
  }

  /**
   * Special route that get the resource id to redirect to the view config page
   * @param viewConfigId
   */
  public static getViewConfigRedirectRoute(viewConfigId: string): string {
    return `${liConstResourceFullRoute}/view-redirect/${viewConfigId}`;
  }

  public static getNoteSearchRoute(): string {
    return liConstNoteFullRoute;
  }

  public static getNoteDetailRoute(id: string): string {
    return `${liConstNoteFullRoute}/${id}`;
  }

  public static getNoteTemplateSearchRoute(): string {
    return liConstNoteTemplateFullRoute;
  }

  public static getNoteTemplateDetailRoute(id: string): string {
    return `${liConstNoteTemplateFullRoute}/${id}`;
  }

  public static getDocRoute(): string {
    return liConstDocFullRoute;
  }

  public static getTechnicalDocRoute(typingName: string): string {
    typingName = typingName.replaceAll('.', '-');
    return `${LiRouterService.getDocRoute()}/technical-doc/${typingName}`;
  }

  public static getLoginRoute(): string {
    return `/login`;
  }

  public static getTagSearchRoute(): string {
    return liConstTagFullRoute;
  }

  public static getTagDetailRoute(key: string): string {
    return `${liConstTagFullRoute}/${key}`;
  }

  /////////////////// MONITORING ///////////////////
  public static getMonitoringRoute(): string {
    return liConstMonitoringFullRoute;
  }

  public static getMonitoringUsageRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/usage`;
  }

  public static getMonitoringVenvsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/virtual-envs`;
  }

  public static getMonitoringLogsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/logs`;
  }

  public static getMonitoringLabRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/lab`;
  }

  public static getMonitoringCredentialsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/credentials`;
  }

  public static getMonitoringActivityRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/activity`;
  }

  public static getMonitoringJobsRoute(): string {
    return `${LiRouterService.getMonitoringRoute()}/jobs`;
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
