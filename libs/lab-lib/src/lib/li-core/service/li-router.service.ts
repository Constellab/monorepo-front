import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {
  LI_CONST_BASE_ROUTE,
  LI_CONST_DOC_FULL_ROUTE,
  LI_CONST_FORM_FULL_ROUTE,
  LI_CONST_FORM_TEMPLATE_FULL_ROUTE,
  LI_CONST_MONITORING_FULL_ROUTE,
  LI_CONST_NOTE_FULL_ROUTE,
  LI_CONST_NOTE_TEMPLATE_FULL_ROUTE,
  LI_CONST_RESOURCE_FULL_ROUTE,
  LI_CONST_SCENARIO_FULL_ROUTE,
  LI_CONST_SCENARIO_TEMPLATE_FULL_ROUTE,
  LI_CONST_TAG_FULL_ROUTE,
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
    return `/${LI_CONST_BASE_ROUTE}`;
  }

  public static getScenarioListRoute(): string {
    return LI_CONST_SCENARIO_FULL_ROUTE;
  }

  public static getDataboxRoute(): string {
    return LI_CONST_RESOURCE_FULL_ROUTE;
  }

  public static getScenarioDetailRoute(id: string): string {
    return `${LI_CONST_SCENARIO_FULL_ROUTE}/${id}`;
  }

  public static getScenarioTemplatesRoute(): string {
    return `${LI_CONST_SCENARIO_TEMPLATE_FULL_ROUTE}`;
  }

  public static getScenarioTemplateDetailRoute(id: string): string {
    return `${LI_CONST_SCENARIO_TEMPLATE_FULL_ROUTE}/${id}`;
  }

  public static getResourceDetailRoute(id: string): string {
    return `${LI_CONST_RESOURCE_FULL_ROUTE}/${id}`;
  }

  public static getViewConfigDetailRoute(
    resourceId: string,
    viewConfigId: string
  ): {
    route: string;
    queryParams: any;
  } {
    return {
      route: `${LI_CONST_RESOURCE_FULL_ROUTE}/${resourceId}`,
      queryParams: { viewId: viewConfigId },
    };
  }

  /**
   * Special route that get the resource id to redirect to the view config page
   * @param viewConfigId
   */
  public static getViewConfigRedirectRoute(viewConfigId: string): string {
    return `${LI_CONST_RESOURCE_FULL_ROUTE}/view-redirect/${viewConfigId}`;
  }

  public static getNoteSearchRoute(): string {
    return LI_CONST_NOTE_FULL_ROUTE;
  }

  public static getNoteDetailRoute(id: string): string {
    return `${LI_CONST_NOTE_FULL_ROUTE}/${id}`;
  }

  public static getNoteTemplateSearchRoute(): string {
    return LI_CONST_NOTE_TEMPLATE_FULL_ROUTE;
  }

  public static getNoteTemplateDetailRoute(id: string): string {
    return `${LI_CONST_NOTE_TEMPLATE_FULL_ROUTE}/${id}`;
  }

  public static getFormSearchRoute(): string {
    return LI_CONST_FORM_FULL_ROUTE;
  }

  public static getFormDetailRoute(id: string): string {
    return `${LI_CONST_FORM_FULL_ROUTE}/${id}`;
  }

  public static getFormTemplateDetailRoute(id: string): string {
    return `${LI_CONST_FORM_TEMPLATE_FULL_ROUTE}/${id}`;
  }

  public static getFormTemplateVersionRoute(templateId: string, versionId: string): string {
    return `${LI_CONST_FORM_TEMPLATE_FULL_ROUTE}/${templateId}/versions/${versionId}`;
  }

  public static getDocRoute(): string {
    return LI_CONST_DOC_FULL_ROUTE;
  }

  public static getTechnicalDocRoute(typingName: string): string {
    typingName = typingName.replaceAll('.', '-');
    return `${LiRouterService.getDocRoute()}/technical-doc/${typingName}`;
  }

  public static getLoginRoute(): string {
    return `/login`;
  }

  public static getTagSearchRoute(): string {
    return LI_CONST_TAG_FULL_ROUTE;
  }

  public static getTagDetailRoute(key: string): string {
    return `${LI_CONST_TAG_FULL_ROUTE}/${key}`;
  }

  /////////////////// MONITORING ///////////////////
  public static getMonitoringRoute(): string {
    return LI_CONST_MONITORING_FULL_ROUTE;
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

  public navigateToFormDetail(id: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getFormDetailRoute(id)]);
  }

  public navigateToFormTemplateDetail(id: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getFormTemplateDetailRoute(id)]);
  }

  public navigateToFormTemplateVersion(templateId: string, versionId: string): Promise<boolean> {
    return this.router.navigate([LiRouterService.getFormTemplateVersionRoute(templateId, versionId)]);
  }

  public navigateToDocumentSearch(): Promise<boolean> {
    return this.router.navigate([LiRouterService.getNoteTemplateSearchRoute()]);
  }

  public navigateToViewConfig(resourceId: string, viewConfigId: string): Promise<boolean> {
    const viewRoute = LiRouterService.getViewConfigDetailRoute(resourceId, viewConfigId);
    return this.router.navigate([viewRoute.route], { queryParams: viewRoute.queryParams });
  }
}
