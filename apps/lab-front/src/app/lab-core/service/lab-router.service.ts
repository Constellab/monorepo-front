import { Injectable } from '@angular/core';
import {
  labConstBaseRoute,
  labConstBioxFullRoute,
  labConstDataboxFullRoute,
  labConstDocFullRoute,
  labConstMonitoringFullRoute,
  labConstNoteFullRoute,
  labConstNoteTemplateFullRoute,
  labConstScenarioTemplateFullRoute
} from '../utils/lab-base-route';
import { Router } from '@angular/router';

/**
 * Class to get app route paths
 */
@Injectable({
  providedIn: 'root'
})
export class LabRouterService {

  constructor(private router: Router) {
  }

  ////// Static function to get routes  //////
  public static getAppRoute(): string {
    return `/${labConstBaseRoute}`;
  }

  public static getScenarioListRoute(): string {
    return labConstBioxFullRoute;
  }

  public static getDataboxRoute(): string {
    return labConstDataboxFullRoute;
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
    return `${labConstDataboxFullRoute}/resource/${id}`;
  }

  public static getViewConfigDetailRoute(resourceId: string, viewConfigId: string): {
    route: string,
    queryParams: any
  } {
    return {
      route: `${labConstDataboxFullRoute}/resource/${resourceId}`,
      queryParams: {viewId: viewConfigId}
    };
  }

  /**
   * Special route that get the resource id to redirect to the view config page
   * @param viewConfigId
   */
  public static getViewConfigRedirectRoute(viewConfigId: string): string {
    return `${labConstDataboxFullRoute}/view-redirect/${viewConfigId}`;
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
    typingName = typingName.replaceAll('.', '-')
    return `${LabRouterService.getDocRoute()}/technical-doc/${typingName}`;
  }

  public static getLoginRoute(): string {
    return `/login`;
  }

  /////////////////// MONITORING ///////////////////
  public static getMonitoringRoute(): string {
    return labConstMonitoringFullRoute;
  }

  public static getMonitoringUsageRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/usage`;
  }

  public static getMonitoringTagsRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/tags`;
  }

  public static getMonitoringVenvsRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/venvs`;
  }

  public static getMonitoringLogsRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/logs`;
  }

  public static getMonitoringCredentialsRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/credentials`;
  }

  public static getMonitoringActivityRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/activity`;
  }

  public static getOtherRoute(): string {
    return `${LabRouterService.getMonitoringRoute()}/other`;
  }

  /////////////////// NAVIGATE METHODS ///////////////////
  public navigateToAppRoute(): void {
    this.router.navigate([LabRouterService.getAppRoute()]);
  }

  public navigateToScenarioListRoute(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getScenarioListRoute()]);
  }

  public navigateToDatabox(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getDataboxRoute()]);
  }

  public navigateToScenarioDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getScenarioDetailRoute(id)]);
  }

  public navigateToResourceDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getResourceDetailRoute(id)]);
  }

  public navigateToScenarioTemplates(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getScenarioTemplatesRoute()]);
  }

  public navigateToNoteDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getNoteDetailRoute(id)]);
  }

  public navigateToNoteTemplateDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getNoteTemplateDetailRoute(id)]);
  }

  public navigateToNoteSearch(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getNoteSearchRoute()]);
  }

  public navigateToDocumentSearch(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getNoteTemplateSearchRoute()]);
  }

  public navigateToViewConfig(resourceId: string, viewConfigId: string): Promise<boolean> {
    const viewRoute = LabRouterService.getViewConfigDetailRoute(resourceId, viewConfigId);
    return this.router.navigate([viewRoute.route], {queryParams: viewRoute.queryParams});
  }

}
