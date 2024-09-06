import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, first, Observable, of, switchMap } from 'rxjs';
import { CaProject } from '../../../../ca-core/model/entities/project/ca-project.class';
import { CaProjectService } from '../../../../ca-core/service-api/ca-project.service';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { map } from 'rxjs/operators';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import { FlArrayObs, FlEntityArrayObs, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { ClCoreJsonConvert, clGetEmptyPage, ClSubscriptionHandler } from '@monorepo/core-lib';
import { CaProjectObjectDetailState } from '../../ca-project-object-core/state/ca-project-object-detail.state';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CaFolder, CaFolderDatasource } from '../../../../ca-core/model/entities/project/ca-folder.class';
import { CaFolderSearchFields } from '../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-search.class';

interface CaSearchChildrenData {
  parentId: string;
  filters: Partial<CaFolderSearchFields>;
}

@Injectable()
export class CaProjectDetailState implements OnDestroy {

  private id$: Observable<string>;

  private project$: BehaviorSubject<CaProject>;
  private users$: FlArrayObs<CaUser>;
  private childrenDatasource: CaFolderDatasource;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private projectService: CaProjectService,
              private authenticatedUserService: CaAuthenticatedUserService,
              private projectObjectDetailState: CaProjectObjectDetailState) {
  }

  public init(id$: Observable<string>): void {
    this.id$ = id$;
    this.project$ = new BehaviorSubject(null);

    this.subscription.add(this.id$.pipe(
      switchMap(id => this.projectService.getById(id))
    ).subscribe({
      next: project => this.initProject(project),
      error: error => this.project$.error(error)
    }));

    this.childrenDatasource = new FlEntityPaginatedDatasource<CaFolder>(
      (page, pageSize, requestData: CaSearchChildrenData) => {
        if (!requestData) return of(clGetEmptyPage());
        return this.projectService.searchChildren(requestData.parentId, page, pageSize, requestData.filters);
      }, 30, false);

    this.users$ = new FlEntityArrayObs(this.id$.pipe(
      first(), // as the share is handle at the root project level, not need to refresh it every time
      switchMap(id => this.projectService.getUsersOfProject(id))
    ), true);

  }

  private initProject(project: CaProject): void {
    this.project$.next(project);
    const data: CaSearchChildrenData = { parentId: project.id, filters: {} };
    this.childrenDatasource.getFirstPage(data);
  }

  public getFolderId$(): Observable<string> {
    return this.id$;
  }

  public getCurrentProject(): CaProject | null {
    return this.project$.value;
  }

  public getProject$(skipNull: boolean = true): Observable<CaProject> {
    return this.project$.asObservable().pipe(
      filter(project => !skipNull || project != null)
    );
  }

  public isRootProject$(): Observable<boolean> {
    return this.projectObjectDetailState.getProjectAncestors$().pipe(
      // using 1 because the current project is in the ancestors
      map(ancestors => ancestors.length <= 1)
    );
  }

  public getUsers(): FlArrayObs {
    return this.users$;
  }

  public canEditProject$(): Observable<boolean> {
    const user = this.authenticatedUserService.getCurrentUser();

    return this.getProject$(false).pipe(
      map(project => this.authenticatedUserService.isCurrentSpaceAdmin() ||
        (project != null && project.leader.id === user.id))
    );
  }

  public updateDescription(description: TeRichTextContent): void {
    const project = this.getCurrentProject();
    this.projectService.updateDescription(project.id, description as any).subscribe();
  }

  public getChildrenDatasource(): CaFolderDatasource {
    return this.childrenDatasource;
  }

  public addFolderChild(folder: CaFolder): void {
    if (folder.parentId === this.getCurrentProject().id) {
      this.childrenDatasource.unshiftItem(folder);
    }
    this.projectObjectDetailState.addFolderInTree(folder);
  }

  public updateProject(project: CaProject): void {
    if (this.getCurrentProject().id === project.id) {
      this.project$.next(project);
    }
    this.updatePartialFolderChild(project.id, { name: project.title, user: project.leader });
  }

  public updatePartialFolderChild(folderId: string, folder: Partial<CaFolder>): void {
    const childFolder = this.childrenDatasource.findItemById(folderId);
    if (childFolder) {
      // create a new folder based on the old one and the new data
      const cloned = ClCoreJsonConvert.deepCloneClassAndMerge(childFolder, folder, CaFolder);
      this.childrenDatasource.updateItem(cloned);
    }

    this.projectObjectDetailState.updateFolder(folderId, folder);
  }

  public deleteFolder(id: string): void {
    // delete project if it is in the children
    const folder = this.childrenDatasource.findItemById(id);
    if (folder) {
      this.childrenDatasource.removeItemById(id);
    }

    // delete project in the tree
    this.projectObjectDetailState.deleteFolderInTree(id);

    // if the delete project is the current project, navigate to the parent folder
    if (id === this.getCurrentProject().id) {
      this.projectObjectDetailState.navigateToParentFolder();
    }
  }

  public filterChildren(filters: Partial<CaFolderSearchFields>): void {
    const data: CaSearchChildrenData = this.childrenDatasource.getRequestData();
    const newData = Object.assign({}, data, { filters });
    this.childrenDatasource.getFirstPage(newData);
  }


  ngOnDestroy(): void {
    this.project$?.complete();
    this.users$?.disconnect();
    this.childrenDatasource?.manualDisconnect();
    this.subscription?.unsubscribe();
  }


}
