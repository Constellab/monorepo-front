import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, filter, first, Observable, switchMap} from 'rxjs';
import {CaProject} from '../../../../ca-core/model/entities/project/ca-project.class';
import {CaProjectService} from '../../../../ca-core/service-api/ca-project.service';
import {CaUser} from '../../../../ca-core/model/entities/ca-user.class';
import {map} from 'rxjs/operators';
import {CaAuthenticatedUserService} from '../../../../ca-core/service-api/ca-authenticated-user.service';
import {FlArrayObs, FlEntityArrayObs, FlQueryParamHandler} from '@monorepo/front-core-lib';
import {ActivatedRoute, Router} from '@angular/router';
import {CaReport} from '../../../../ca-core/model/entities/project/ca-report.class';
import {CaExperiment} from '../../../../ca-core/model/entities/project/ca-experiment.class';
import {CaReportService} from '../../../../ca-core/service-api/ca-report.service';
import {CaExperimentService} from '../../../../ca-core/service-api/ca-experiment.service';
import {CaBaseEntity} from '../../../../ca-core/model/entities/ca-base-entity.class';
import {ClHelpService, ClSubscriptionHandler} from '@monorepo/core-lib';
import {CaProjectObjectDetailState} from '../../ca-project-object-core/state/ca-project-object-detail.state';
import {CaRouterService} from '../../../../ca-core/service/ca-router.service';
import {TeRichTextContent} from '@monorepo/text-editor';

export type CaProjectDetailRightPanel = {
  type: 'description' | 'report' | 'experiment' | 'comments' | 'settings';
  objectId: string;
}


@Injectable()
export class CaProjectDetailState implements OnDestroy {

  private id$: Observable<string>;

  private project$: BehaviorSubject<CaProject>;
  private users$: FlArrayObs<CaUser>;
  private reports$: FlArrayObs<CaReport>;
  private experiments$: FlArrayObs<CaExperiment>;
  private children$: FlEntityArrayObs<CaProject>;
  private rightPanelState$: BehaviorSubject<CaProjectDetailRightPanel>;

  private queryParamHandler: FlQueryParamHandler<CaProjectDetailRightPanel>;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private projectService: CaProjectService,
              private authenticatedUserService: CaAuthenticatedUserService,
              route: ActivatedRoute,
              router: Router,
              private routerService: CaRouterService,
              private experimentService: CaExperimentService,
              private reportService: CaReportService,
              private projectObjectDetailState: CaProjectObjectDetailState) {
    this.queryParamHandler = new FlQueryParamHandler(router, route);
  }

  public init(id$: Observable<string>): void {
    this.id$ = id$;
    this.project$ = new BehaviorSubject<CaProject>(null);
    this.reports$ = new FlEntityArrayObs(null, true);
    this.experiments$ = new FlEntityArrayObs(null, true);
    this.children$ = new FlEntityArrayObs(null, true);
    this.rightPanelState$ = new BehaviorSubject<CaProjectDetailRightPanel>(null);

    this.subscription.add(this.id$.pipe(
      switchMap(id => this.projectService.getById(id))
    ).subscribe({
      next: project => this.initProject(project),
      error: error => this.project$.error(error)
    }));


    this.users$ = new FlEntityArrayObs(this.id$.pipe(
      first(), // as the share is handle at the root project level, not need to refresh it every time
      switchMap(id => this.projectService.getUsersOfProject(id)),
    ), true);

    this.subscription.add(this.id$.pipe(
      switchMap(() => this.queryParamHandler.getQueryParams())
    ).subscribe(
      params => this.onRightPanelStateUpdate(params)
    ));
  }

  private initProject(project: CaProject): void {
    this.project$.next(project);

    // if the project is a leaf, load the reports and experiments
    if (project.isLeaf()) {
      this.reportService.getReportsByProject(project.id).subscribe({
        next: reports => this.reports$.array = reports,
        error: error => this.reports$.error(error)
      });
      this.experimentService.getExperimentsByProject(project.id).subscribe({
        next: experiments => this.experiments$.array = experiments,
        error: error => this.experiments$.error(error)
      });
    } else {
      this.projectService.getChildren(project.id).subscribe({
        next: children => this.children$.array = children,
        error: error => this.children$.error(error)
      });
    }
  }

  public getProjectId$(): Observable<string> {
    return this.id$;
  }


  public updateCurrentProject(project: CaProject): void {
    this.project$.next(project);
    this.projectObjectDetailState.updateProject(project);
  }

  public getCurrentProject(): CaProject | null {
    return this.project$.value;
  }

  public getProject$(skipNull: boolean = true): Observable<CaProject> {
    return this.project$.asObservable().pipe(
      filter(project => !skipNull || project != null)
    );
  }

  public getUsers(): FlArrayObs {
    return this.users$;
  }

  /**
   * Call when a query param change event is triggered
   */
  private onRightPanelStateUpdate(state: CaProjectDetailRightPanel): void {
    // default value for the state
    if (state.type == null) {
      state = {type: 'comments', objectId: null};
    }

    // check if the state has changed
    const currentState = this.rightPanelState$.value;
    if (currentState && currentState.type === state.type &&
      currentState.objectId === state.objectId) {
      return;
    }

    this.rightPanelState$.next(state);
  }

  public updateRightPanelState(state: CaProjectDetailRightPanel): void {
    this.queryParamHandler.mergeQueryParams(state);
  }

  public getRightPanelState$(): Observable<CaProjectDetailRightPanel> {
    return this.rightPanelState$.asObservable().pipe(filter(state => state != null));
  }

  public canEditProject$(): Observable<boolean> {
    const user = this.authenticatedUserService.getUser();

    return this.getProject$(false).pipe(
      map(project => this.authenticatedUserService.isCurrentSpaceAdmin() ||
        (project != null && project.leader.id === user.id))
    );
  }

  public updateDescription(description: TeRichTextContent): void {
    const project = this.getCurrentProject();
    this.projectService.updateDescription(project.id, description as any).subscribe();
  }

  public getReports$(): FlArrayObs<CaReport> {
    return this.reports$;
  }

  public getReport$(id: string): Observable<CaReport> {
    return this.getReports$().connect().pipe(
      map(reports => reports.find(report => report.id === id))
    );
  }

  public getExperiments$(): FlArrayObs<CaExperiment> {
    return this.experiments$;
  }

  public filterByUsers(users: CaUser[]): void {
    const filterName: string = 'users';

    if (users?.length > 0) {
      const userFilter: (entity: CaBaseEntity) => boolean = (entity: CaBaseEntity) => {
        return users.some(user => user.id === entity.createdBy.id);
      };
      this.reports$.addFilter(filterName, userFilter);
      this.experiments$.addFilter(filterName, userFilter);

      const projectLeaderFileter: (project: CaProject) => boolean = (entity: CaProject) => {
        return users.some(user => user.id === entity.leader.id);
      };
      this.children$.addFilter(filterName, projectLeaderFileter);
    } else {
      this.reports$.removeFilter(filterName);
      this.experiments$.removeFilter(filterName);
      this.children$.removeFilter(filterName);
    }
  }

  public getChildren$(): FlEntityArrayObs<CaProject> {
    return this.children$;
  }

  public addChild(project: CaProject): void {
    this.children$.addItem(project,
      (a, b) => ClHelpService.sortAlphabeticalFunction(a.code, b.code) < 0);
    this.projectObjectDetailState.addProjectChild(project);
  }

  public deleteProject(project: CaProject): void {
    if (project.parentId != null) {
      this.routerService.navigateToProjectDetail(project.parentId);
    } else {
      this.routerService.navigateToDashboard();
    }
    this.projectObjectDetailState.deleteProject(project.id);
  }

  ngOnDestroy(): void {
    this.project$?.complete();
    this.users$?.disconnect();
    this.reports$?.manualDisconnect();
    this.experiments$?.manualDisconnect();
    this.children$?.manualDisconnect();
    this.rightPanelState$?.complete();
    this.subscription?.unsubscribe();
  }


}
