import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  first,
  firstValueFrom,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { FlQueryParamHandler, FlRouterHelper } from '@monorepo/front-core-lib/fl-core';

import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { ClCoreJsonConvert, ClSubscriptionHandler } from '@monorepo/core-lib';
import {
  CaHierarchyObject,
  CaHierarchyObjectSimple,
  CaHierarchyObjectsTreeDatasource,
  CaHierarchyObjectTagDatasource,
  CaHierarchyObjectType,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../../../ca-core/service/ca-router.service';
import { CaHierarchyObjectService } from '../../../../ca-core/service-api/ca-hierarchy-object.service';
import { FlTagDatasource } from '@monorepo/front-core-lib/fl-tag';
import { CaAvailableTagDatasource } from '../../../../ca-core/model/entities/ca-tag.class';

/**
 * State for the CaHierarchyObjectDetailPageComponent
 */
@Injectable()
export class CaHierarchyObjectDetailState implements OnDestroy {
  private folderService = inject(CaFolderService);
  private hierarchyObjectService = inject(CaHierarchyObjectService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routerService = inject(CaRouterService);
  private queryParamHandler: FlQueryParamHandler<{ showTree?: string }> = inject(FlQueryParamHandler);

  private hierarchyObject$: BehaviorSubject<CaHierarchyObject>;
  private hierarchyObjectId$: Observable<string>;
  private folderTree: CaHierarchyObjectsTreeDatasource;

  // list of tag of current object
  private tags: CaHierarchyObjectTagDatasource = new FlTagDatasource();
  // list of available tags for the children of the current object
  private childrenTags: CaAvailableTagDatasource = new CaAvailableTagDatasource();

  // by default the tree is opened
  private treeDrawerOpened$: BehaviorSubject<boolean>;

  private subscriptions = new ClSubscriptionHandler();

  // used to unsubscribe from all the observables
  private destroy = new Subject<void>();

  public init(): void {
    this.folderTree = new CaHierarchyObjectsTreeDatasource();
    this.treeDrawerOpened$ = new BehaviorSubject(false);
    this.hierarchyObject$ = new BehaviorSubject(null);

    // we need to use the FlRouterHelper.listenToChildrenParams because the current route is the parent route
    this.hierarchyObjectId$ = FlRouterHelper.listenToChildrenParams(this.router, this.route).pipe(
      map((params) => params.id),
      takeUntil(this.destroy)
    );

    // load the ancestors of the current object
    this.subscriptions.add(
      this.getHierarchyObject$()
        .pipe(
          filter((hierarchyObject) => hierarchyObject != null),
          // only load the ancestors in the first call, then the ancestors should already be loaded
          first(),
          switchMap((hierarchyObject) =>
            this.folderService.getObjectFolderAncestors(hierarchyObject.getFolderId())
          )
        )
        .subscribe((ancestors) => this.addFoldersInTree(ancestors.reverse()))
    );

    // load the root folders
    this.folderService.getAllRootFolders().subscribe((folders) => this.addHierarchyFolderInTree(folders));

    this.initTreeDrawerOpened();

    // handle tags
    this.subscriptions.add(
      this.hierarchyObjectId$.subscribe((id) => {
        if (id) {
          // load the tags
          this.tags.setData(this.hierarchyObjectService.getAllTags(id));
        } else {
          this.tags.setData([]);
        }
      })
    );

    this.subscriptions.add(
      this.hierarchyObjectId$
        .pipe(
          switchMap((objectId) => {
            if (objectId) {
              return this.hierarchyObjectService.getHierarchyObject(objectId);
            } else {
              return of(null);
            }
          })
        )
        .subscribe((hierarchyObject) => this.hierarchyObject$.next(hierarchyObject))
    );

    // load all the available tags for the children of the current object
    // only called if the current object is a folder
    this.subscriptions.add(
      this.getHierarchyObject$()
        .pipe(
          filter(
            (hierarchyObject) =>
              hierarchyObject && hierarchyObject.objectType === CaHierarchyObjectType.FOLDER
          ),
          switchMap((hierarchyObjectService) =>
            this.hierarchyObjectService.getAvailableTagsInChildren(hierarchyObjectService.id)
          ),
          map((tags) => tags.tags)
        )
        .subscribe((tags) => this.childrenTags.setData(tags))
    );
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

  public getHierarchyObject$(): Observable<CaHierarchyObject> {
    return this.hierarchyObject$;
  }

  /**
   * Retrieve the ancestors from the current object to the root folder
   */
  public getAncestorsFolders$(): Observable<CaHierarchyObjectSimple[]> {
    return this.getHierarchyObject$().pipe(
      switchMap((hierarchyObject) => {
        if (hierarchyObject) {
          return this.folderTree.findAncestorsObject$(hierarchyObject.getFolderId());
        } else {
          return of([]);
        }
      })
    );
  }

  public getCurrentParentFolder(): Promise<CaHierarchyObjectSimple | null> {
    return firstValueFrom(
      this.getAncestorsFolders$().pipe(
        // the first element is the current object, we return the second element which is the parent
        map((ancestors) => (ancestors.length > 1 ? ancestors[1] : null))
      )
    );
  }

  public navigateToParentFolder(): void {
    this.getCurrentParentFolder().then((parentFolder) => {
      if (parentFolder) {
        this.routerService.navigateToFolderDetail(parentFolder.id);
      } else {
        this.routerService.navigateToDashboard();
      }
    });
  }

  public getFolderTree(): CaHierarchyObjectsTreeDatasource {
    return this.folderTree;
  }

  public addFoldersInTree(folders: CaHierarchyObject[]): void {
    const simpleFolders = folders.map((folder) => CaHierarchyObjectSimple.fromHierarchyObject(folder));
    this.addHierarchyFolderInTree(simpleFolders);
  }

  public addHierarchyFolderInTree(folders: CaHierarchyObjectSimple[]): void {
    this.folderTree.addHierarchyObjects(folders);
  }

  public deleteFolderInTree(folderId: string): void {
    this.folderTree.deleteNode(folderId);
  }

  public updateFolder(folderId: string, folder: Partial<CaHierarchyObject>): void {
    // update in the tree
    const folderInTree = this.folderTree.findNodeObject(folderId);
    if (folderInTree) {
      const clone = ClCoreJsonConvert.deepCloneClassAndMerge(folderInTree, folder, CaHierarchyObjectSimple);
      this.folderTree.updateNodeInfo(clone);
    }
  }

  public getTreeDrawerOpened$(): Observable<boolean> {
    return this.treeDrawerOpened$.asObservable();
  }

  public getFolder$(folderId: string): Observable<CaHierarchyObjectSimple> {
    return this.folderTree.findNodeObject$(folderId);
  }

  public getTags(): CaHierarchyObjectTagDatasource {
    return this.tags;
  }

  public getRootFolder$(): Observable<CaHierarchyObjectSimple> {
    return this.getAncestorsFolders$().pipe(
      filter((ancestors) => ancestors.length > 0),
      map((ancestors) => ancestors[ancestors.length - 1])
    );
  }

  public getChildrenAvailableTags(): CaAvailableTagDatasource {
    return this.childrenTags
  }

  private initTreeDrawerOpened(): void {
    // init tree open
    this.queryParamHandler.getFirstQueryParams().subscribe(
      // if the query param is not present, the tree is opened
      (params) => this.treeDrawerOpened$.next(params.showTree !== 'false')
    );
  }

  ngOnDestroy(): void {
    this.treeDrawerOpened$?.complete();
    this.folderTree?.disconnect();
    this.subscriptions?.unsubscribe();
    this.destroy.next();
    this.destroy.complete();
    this.tags.manualDisconnect();
    this.childrenTags.manualDisconnect();
  }
}
