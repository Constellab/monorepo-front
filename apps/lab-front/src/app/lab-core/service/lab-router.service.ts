import {Injectable} from '@angular/core';
import {
  labConstBaseRoute,
  labConstBioxFullRoute,
  labConstDataboxFullRoute,
  labConstDocFullRoute,
  labConstMonitoringFullRoute,
  labConstProtocolTemplateFullRoute,
  labConstReportFullRoute,
  labConstReportTemplateFullRoute
} from '../utils/lab-base-route';
import {Router} from '@angular/router';

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

  public static getExperimentListRoute(): string {
    return labConstBioxFullRoute;
  }

  public static getDataboxRoute(): string {
    return labConstDataboxFullRoute;
  }

  public static getExperimentDetailRoute(id: string): string {
    return `${labConstBioxFullRoute}/experiment/${id}`;
  }

  public static getProtocolTemplatesRoute(): string {
    return `${labConstProtocolTemplateFullRoute}`;
  }

  public static getProtocolTemplateDetailRoute(id: string): string {
    return `${labConstProtocolTemplateFullRoute}/${id}`;
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


  public static getReportSearchRoute(): string {
    return labConstReportFullRoute;
  }

  public static getReportDetailRoute(id: string): string {
    return `${labConstReportFullRoute}/${id}`;
  }

  public static getReportTemplateDetailRoute(id: string): string {
    return `${labConstReportTemplateFullRoute}/${id}`;
  }

  public static getDocRoute(): string {
    return labConstDocFullRoute;
  }

  public static getTechnicalDocRoute(typingName: string): string {
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

  public navigateToExperimentListRoute(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getExperimentListRoute()]);
  }

  public navigateToDatabox(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getDataboxRoute()]);
  }

  public navigateToExperimentDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getExperimentDetailRoute(id)]);
  }

  public navigateToResourceDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getResourceDetailRoute(id)]);
  }

  public navigateToProtocolTemplates(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getProtocolTemplatesRoute()]);
  }

  public navigateToReportDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getReportDetailRoute(id)]);
  }

  public navigatorToReportTemplateDetail(id: string): Promise<boolean> {
    return this.router.navigate([LabRouterService.getReportTemplateDetailRoute(id)]);
  }

  public navigateToReportSearch(): Promise<boolean> {
    return this.router.navigate([LabRouterService.getReportSearchRoute()]);
  }

  public navigateToViewConfig(resourceId: string, viewConfigId: string): Promise<boolean> {
    const viewRoute = LabRouterService.getViewConfigDetailRoute(resourceId, viewConfigId);
    return this.router.navigate([viewRoute.route], {queryParams: viewRoute.queryParams});
  }

}
