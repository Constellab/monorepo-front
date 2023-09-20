import {Injectable, OnDestroy} from '@angular/core';
import {BehaviorSubject, filter, first, Observable, share, switchMap} from 'rxjs';
import {
  CaProject,
  CaProjectAncestorTreeDTO,
  CaProjectObjectRef,
  CaProjectTreeDto
} from '../../../../ca-core/model/entities/project/ca-project.class';
import {CaProjectService} from '../../../../ca-core/service-api/ca-project.service';
import {FlDatasourceTree, FlQueryParamHandler, FlRouterHelper} from '@monorepo/front-core-lib';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {ClHelpService} from '@monorepo/core-lib';

/**
 * State for the CaProjectObjectDetailPageComponent
 */
@Injectable()
export class CaProjectObjectDetailState implements OnDestroy {

  private projectAncestors$: Observable<CaProjectAncestorTreeDTO[]>;
  private projectTree$: FlDatasourceTree<CaProjectTreeDto>;

  private treeDrawerOpened$: BehaviorSubject<boolean>;
  private queryParamHandler: FlQueryParamHandler<{ showTree?: boolean }>;

  constructor(private projectService: CaProjectService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public init(): void {
    const projectObjectRef$ = FlRouterHelper.listenToChildrenParams(this.router, this.route)
      .pipe(
        map(params => this.getProjectObjectRef(params))
      );

    this.projectAncestors$ = projectObjectRef$.pipe(
      switchMap(projectObjectRef => this.projectService.getObjectProjectAncestors(projectObjectRef.type, projectObjectRef.id)),
      share() // share the observable result for multiple subscribers, use share not ClCachedObservable because it emits multiples values
    );

    this.projectTree$ = new FlDatasourceTree<CaProjectTreeDto>(null,
      (a, b) => ClHelpService.sortAlphabeticalFunction(a.code, b.code));
    projectObjectRef$.pipe(
      // as the tree start with the root, it only needs to be loaded once
      first(),
      switchMap(projectObject => this.projectService.getProjectTree(projectObject.type, projectObject.id)),
    ).subscribe({
      next: projectTree => this.getTreeSuccess(projectTree),
    });

    this.treeDrawerOpened$ = new BehaviorSubject(false);

    this.initTreeDrawerOpened();
  }

  private getTreeSuccess(projectTree: CaProjectTreeDto): void {
    this.projectTree$.setData(projectTree);

    // if there is no hierarchy, force the tree to be closed
    if (projectTree?.children.length > 0) {
      this.setTreeOpened(true);
    } else {
      this.setTreeOpened(false);
    }
  }

  public rootProjectHasChildren$(): Observable<boolean> {
    return this.getProjectTree$().pipe(
      map(ancestors => ancestors.children.length > 0)
    );
  }

  private getProjectObjectRef(params: Params): CaProjectObjectRef {
    if (params.experimentId) {
      return {
        type: 'experiment',
        id: params.experimentId
      };
    } else if (params.reportId) {
      return {
        type: 'report',
        id: params.reportId
      };
    } else if (params.documentId) {
      return {
        type: 'document',
        id: params.documentId
      };
    } else {
      return {
        type: 'project',
        id: params.projectId
      };
    }
  }

  private initTreeDrawerOpened(): void {
    this.queryParamHandler = new FlQueryParamHandler(this.router, this.route);
    // init tree open
    this.queryParamHandler.getFirstQueryParams().subscribe(
      params => {
        if (params.showTree) {
          this.treeDrawerOpened$.next(true);
        }
      }
    );
  }

  toggleTree(): void {
    this.setTreeOpened(!this.treeDrawerOpened$.value);
  }

  public setTreeOpened(treeOpened: boolean): void {
    this.treeDrawerOpened$.next(treeOpened);
    if (treeOpened) {
      this.queryParamHandler.mergeQueryParams({showTree: true});
    } else {
      this.queryParamHandler.mergeQueryParams({showTree: null});
    }
  }

  public getProjectAncestors$(): Observable<CaProjectAncestorTreeDTO[]> {
    return this.projectAncestors$;
  }

  public getProjectTree$(): Observable<CaProjectTreeDto> {
    return this.projectTree$.connect().pipe(
      filter(projectTree => projectTree != null)
    );
  }

  public addProjectChild(project: CaProject): void {
    const projectTree = this.projectToTree(project);
    this.projectTree$.addNode(projectTree, project.parentId);
  }

  public updateProject(project: CaProject): void {
    const projectTree = this.projectToTree(project);
    this.projectTree$.updateNode(projectTree);
  }

  private projectToTree(project: CaProject): CaProjectTreeDto {
    return {
      id: project.id,
      code: project.code,
      title: project.title,
      children: [],
      levelStatus: project.levelStatus
    };
  }

  public deleteProject(projectId: string): void {
    this.projectTree$.deleteNode(projectId);
  }


  public getTreeDrawerOpened$(): Observable<boolean> {
    return this.treeDrawerOpened$.asObservable();
  }

  ngOnDestroy(): void {
    this.treeDrawerOpened$?.complete();
    this.projectTree$?.disconnect();
  }


}
