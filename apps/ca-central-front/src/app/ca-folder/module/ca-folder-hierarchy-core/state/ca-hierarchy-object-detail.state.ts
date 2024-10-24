import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, first, firstValueFrom, Observable, Subscription, switchMap } from 'rxjs';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { FlDatasourceTree, FlEntityArrayObs, FlQueryParamHandler, FlRouterHelper } from '@monorepo/front-core-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ClCoreJsonConvert, ClHelpService } from '@monorepo/core-lib';
import {
  CaHierarchyObject,
  CaHierarchyObjectWithChildren
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';

/**
 * State for the CaHierarchyObjectDetailPageComponent
 */
@Injectable()
export class CaHierarchyObjectDetailState implements OnDestroy {

  private ancestorFolders$: FlEntityArrayObs<CaHierarchyObject>;
  private folderTree: FlDatasourceTree<CaHierarchyObjectWithChildren>;

  // by default the tree is opened
  private treeDrawerOpened$: BehaviorSubject<boolean>;
  private queryParamHandler: FlQueryParamHandler<{ showTree?: string }>;

  private subscription: Subscription;

  constructor(private folderService: CaFolderService,
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
      switchMap(objectId => this.folderService.getObjectFolderAncestors(objectId))
    ).subscribe({
      next: ancestors => this.getAncestorSuccess(ancestors)
    });

    this.folderTree = new FlDatasourceTree<CaHierarchyObjectWithChildren>(null,
      (a, b) => ClHelpService.sortAlphabeticalFunction(a.name, b.name));
    objectId$.pipe(
      // as the tree start with the root, it only needs to be loaded once
      first(),
      switchMap(objectId => this.folderService.getFolderTree(objectId))
    ).subscribe({
      next: folderTree => this.getTreeSuccess(folderTree)
    });

    // force closing the tree if there is no sub folders
    this.hasSubFolders$().subscribe(
      hasSubFolders => {
        if (!hasSubFolders) {
          this.setTreeOpened(false);
        }
      }
    );

    this.treeDrawerOpened$ = new BehaviorSubject(false);

    this.initTreeDrawerOpened();
  }

  toggleTree(): void {
    this.setTreeOpened(!this.treeDrawerOpened$.value);
  }

  public setTreeOpened(treeOpened: boolean): void {
    this.treeDrawerOpened$.next(treeOpened);
    if (treeOpened) {
      this.queryParamHandler.mergeQueryParams({ showTree: null });
    } else {
      this.queryParamHandler.mergeQueryParams({ showTree: 'false' });
    }
  }

  /**
   * Retrieve the ancestors from the current object to the root folder
   */
  public getAncestorsFolders$(): Observable<CaHierarchyObject[]> {
    return this.ancestorFolders$.connect();
  }

  public getCurrentParentFolder(): Promise<CaHierarchyObject | null> {
    return firstValueFrom(this.getAncestorsFolders$().pipe(
      // the first element is the current object, we return the second element which is the parent
      map(ancestors => ancestors.length > 1 ? ancestors[1] : null)
    ));
  }

  public navigateToParentFolder(): void {
    this.getCurrentParentFolder().then(parentFolder => {
      if (parentFolder) {
        this.routerService.navigateToFolderDetail(parentFolder.id);
      } else {
        this.routerService.navigateToDashboard();
      }
    });
  }

  public getFolderTree$(): Observable<CaHierarchyObjectWithChildren> {
    return this.folderTree.connect().pipe(
      filter(folderTree => folderTree != null)
    );
  }

  public hasSubFolders$(): Observable<boolean> {
    return this.getFolderTree$().pipe(
      map(folderTree => folderTree.children && folderTree.children.length > 0)
    );
  }

  public addFolderInTree(folder: CaHierarchyObject): void {
    this.folderTree.addNode(CaHierarchyObjectWithChildren.fromHierarchyObject(folder), folder.parentId);
  }

  public deleteFolderInTree(folderId: string): void {
    if (this.folderTree.findNode(folderId)) {
      this.folderTree.deleteNode(folderId);
    }
  }

  public updateFolder(folderId: string, folder: Partial<CaHierarchyObject>): void {
    // update in the ancestors
    const ancestor = this.ancestorFolders$.findItemById(folderId);
    if (ancestor) {
      const clone = ClCoreJsonConvert.deepCloneClassAndMerge(ancestor, folder, CaHierarchyObject);
      this.ancestorFolders$.updateItem(clone);
    }

    // update in the tree
    const folderInTree = this.folderTree.findNode(folderId);
    if (folderInTree) {
      const clone = ClCoreJsonConvert.deepCloneClassAndMerge(folderInTree, folder, CaHierarchyObjectWithChildren);
      this.folderTree.updateNode(clone);
    }
  }

  public getTreeDrawerOpened$(): Observable<boolean> {
    return this.treeDrawerOpened$.asObservable();
  }

  public getFolder$(folderId: string): Observable<CaHierarchyObject> {
    return this.folderTree.findNode$(folderId);
  }

  ngOnDestroy(): void {
    this.treeDrawerOpened$?.complete();
    this.folderTree?.disconnect();
    this.subscription?.unsubscribe();
    this.ancestorFolders$?.disconnect();
  }

  private getTreeSuccess(folderTree: CaHierarchyObjectWithChildren): void {
    this.folderTree.setData(folderTree);
  }

  private getAncestorSuccess(ancestors: CaHierarchyObject[]): void {
    this.ancestorFolders$.array = ancestors;
  }

  private initTreeDrawerOpened(): void {
    this.queryParamHandler = new FlQueryParamHandler(this.router, this.route);
    // init tree open
    this.queryParamHandler.getFirstQueryParams().subscribe(
      // if the query param is not present, the tree is opened
      params => this.treeDrawerOpened$.next(params.showTree !== 'false')
    );
  }


}
