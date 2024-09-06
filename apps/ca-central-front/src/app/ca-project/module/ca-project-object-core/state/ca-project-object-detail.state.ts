import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, first, firstValueFrom, Observable, Subscription, switchMap } from 'rxjs';
import { CaProjectService } from '../../../../ca-core/service-api/ca-project.service';
import { FlDatasourceTree, FlEntityArrayObs, FlQueryParamHandler, FlRouterHelper } from '@monorepo/front-core-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ClCoreJsonConvert, ClHelpService } from '@monorepo/core-lib';
import { CaFolder, CaFolderWithChildren } from '../../../../ca-core/model/entities/project/ca-folder.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';

/**
 * State for the CaProjectObjectDetailPageComponent
 */
@Injectable()
export class CaProjectObjectDetailState implements OnDestroy {

  private ancestorFolders$: FlEntityArrayObs<CaFolder>;
  private folderTree: FlDatasourceTree<CaFolderWithChildren>;

  private treeDrawerOpened$: BehaviorSubject<boolean>;
  private queryParamHandler: FlQueryParamHandler<{ showTree?: boolean }>;

  private subscription: Subscription;

  constructor(private projectService: CaProjectService,
              private route: ActivatedRoute,
              private router: Router,
              private routerService: CaRouterService) {
  }

  public init(): void {
    // we need to use the FlRouterHelper.listenToChildrenParams because the current route is the parent route
    const objectId$: Observable<string> = FlRouterHelper.listenToChildrenParams(this.router, this.route)
      .pipe(
        map(params => params.id)
      );

    this.ancestorFolders$ = new FlEntityArrayObs([]);
    this.subscription = objectId$.pipe(
      switchMap(objectId => this.projectService.getObjectProjectAncestors(objectId))
    ).subscribe({
      next: ancestors => this.getAncestorSuccess(ancestors)
    });

    this.folderTree = new FlDatasourceTree<CaFolderWithChildren>(null,
      (a, b) => ClHelpService.sortAlphabeticalFunction(a.name, b.name));
    objectId$.pipe(
      // as the tree start with the root, it only needs to be loaded once
      first(),
      switchMap(objectId => this.projectService.getProjectTree(objectId))
    ).subscribe({
      next: projectTree => this.getTreeSuccess(projectTree)
    });

    this.treeDrawerOpened$ = new BehaviorSubject(false);

    this.initTreeDrawerOpened();
  }

  private getTreeSuccess(projectTree: CaFolderWithChildren): void {
    this.folderTree.setData(projectTree);
  }

  private getAncestorSuccess(ancestors: CaFolder[]): void {
    this.ancestorFolders$.array = ancestors;
  }

  public rootProjectHasChildren$(): Observable<boolean> {
    return this.getProjectTree$().pipe(
      map(ancestors => ancestors.children.length > 0)
    );
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
      this.queryParamHandler.mergeQueryParams({ showTree: true });
    } else {
      this.queryParamHandler.mergeQueryParams({ showTree: null });
    }
  }

  /**
   * Retrieve the ancestors of the current project from the current object to the root folder
   */
  public getProjectAncestors$(): Observable<CaFolder[]> {
    return this.ancestorFolders$.connect();
  }

  public getCurrentParentFolder(): Promise<CaFolder | null> {
    return firstValueFrom(this.getProjectAncestors$().pipe(
      // the first element is the current object, we return the second element which is the parent
      map(ancestors => ancestors.length > 1 ? ancestors[1] : null)
    ));
  }

  public navigateToParentFolder(): void {
    this.getCurrentParentFolder().then(parentFolder => {
      if (parentFolder) {
        this.routerService.navigateToProjectDetail(parentFolder.id);
      } else {
        this.routerService.navigateToDashboard();
      }
    });
  }

  public getProjectTree$(): Observable<CaFolderWithChildren> {
    return this.folderTree.connect().pipe(
      filter(projectTree => projectTree != null)
    );
  }

  public addFolderInTree(folder: CaFolder): void {
    this.folderTree.addNode(CaFolderWithChildren.fromFolder(folder), folder.parentId);
  }

  public deleteFolderInTree(folderId: string): void {
    if (this.folderTree.findNode(folderId)) {
      this.folderTree.deleteNode(folderId);
    }
  }

  public updateFolder(folderId: string, folder: Partial<CaFolder>): void {
    // update in the ancestors
    const ancestor = this.ancestorFolders$.findItemById(folderId);
    if (ancestor) {
      const clone = ClCoreJsonConvert.deepCloneClassAndMerge(ancestor, folder, CaFolder);
      this.ancestorFolders$.updateItem(clone);
    }

    // update in the tree
    const folderInTree = this.folderTree.findNode(folderId);
    if (folderInTree) {
      const clone = ClCoreJsonConvert.deepCloneClassAndMerge(folderInTree, folder, CaFolderWithChildren);
      this.folderTree.updateNode(clone);
    }
  }

  public getTreeDrawerOpened$(): Observable<boolean> {
    return this.treeDrawerOpened$.asObservable();
  }

  ngOnDestroy(): void {
    this.treeDrawerOpened$?.complete();
    this.folderTree?.disconnect();
    this.subscription?.unsubscribe();
    this.ancestorFolders$?.disconnect();
  }


}
