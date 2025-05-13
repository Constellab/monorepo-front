import { inject, Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  distinctUntilChanged,
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
import { CaHierarchyObjectEvent, CaHierarchyObjectEventState } from './ca-hierarchy-object-event.state';

export interface CaHierarchyObjectContext {
  type: CaHierarchyObjectType | 'rootFolders' | 'globalSearch';
  hierarchyObject?: CaHierarchyObject;
}

export interface CaHierarchyObjectContextId {
  type: 'hierarchyObject' | 'rootFolders' | 'globalSearch';
  hierarchyObjectId?: string;
}

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
  private eventState = inject(CaHierarchyObjectEventState);
  private queryParamHandler: FlQueryParamHandler<{ showTree?: string }> = inject(FlQueryParamHandler);

  private hierarchyObject$: BehaviorSubject<CaHierarchyObjectContext>;
  private hierarchyObjectId$: Observable<CaHierarchyObjectContextId>;
  private folderTree: CaHierarchyObjectsTreeDatasource;

  // list of tag of current object
  private tags: CaHierarchyObjectTagDatasource = new FlTagDatasource();
  // list of available tags for the children of the current object
  private childrenTags: CaAvailableTagDatasource = new CaAvailableTagDatasource(null, true);

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
    this.hierarchyObjectId$ = FlRouterHelper.listenToChildrenRoute(this.router, this.route).pipe(
      map((route): CaHierarchyObjectContextId => {
        if (route.data.context === 'rootFolders') {
          return { type: 'rootFolders' };
        } else if (route.data.context === 'globalSearch') {
          return { type: 'globalSearch' };
        } else {
          return {
            type: 'hierarchyObject',
            hierarchyObjectId: route.params.id,
          };
        }
      }),
      takeUntil(this.destroy),
      distinctUntilChanged(
        (previous, current) =>
          previous.type === current.type && previous.hierarchyObjectId === current.hierarchyObjectId
      )
    );

    // load the ancestors of the current object
    this.subscriptions.add(
      this.getHierarchyContext$()
        .pipe(
          // only load the ancestors in the first call, then the ancestors should already be loaded
          first(),
          filter((hierarchyContext) => hierarchyContext.hierarchyObject != null),
          switchMap((hierarchyContext) =>
            this.hierarchyObjectService.getObjectAncestors(hierarchyContext.hierarchyObject.getFolderId())
          )
        )
        .subscribe((ancestors) => this.addFoldersInTree(ancestors.reverse()))
    );

    // load the root folders
    this.folderService.getAllRootFolders().subscribe((folders) => this.addHierarchyFolderInTree(folders));

    this.initTreeDrawerOpened();

    // handle the current object tags
    this.subscriptions.add(
      this.hierarchyObjectId$.subscribe((contextId) => {
        if (contextId.hierarchyObjectId) {
          // load the tags
          this.tags.setData(this.hierarchyObjectService.getAllTags(contextId.hierarchyObjectId));
        } else {
          this.tags.setData([]);
        }
      })
    );

    // load the current this hierarchy object
    this.subscriptions.add(
      this.hierarchyObjectId$
        .pipe(switchMap((contextId) => this.getHierarchyObjectContext(contextId)))
        .subscribe((hierarchyContext) => {
          // the object might not be in the tree yet so we add it
          if (hierarchyContext.hierarchyObject) {
            this.addFoldersInTree([hierarchyContext.hierarchyObject]);
          }
          this.hierarchyObject$.next(hierarchyContext);
        })
    );

    // load all the available tags for the children of the current object
    // only called if the current object is a folder
    this.subscriptions.add(
      this.getHierarchyContext$()
        .pipe(
          filter(
            (hierarchyObject) =>
              hierarchyObject.type === 'rootFolders' || hierarchyObject.type === CaHierarchyObjectType.FOLDER
          ),
          switchMap((hierarchyContext) => {
            if (hierarchyContext.hierarchyObject == null) {
              return this.hierarchyObjectService.getAvailableTagForRootFolder();
            } else {
              return this.hierarchyObjectService.getAvailableTagsInChildren(
                hierarchyContext.hierarchyObject.id
              );
            }
          }),
          map((tags) => tags.tags)
        )
        .subscribe((tags) => this.childrenTags.setData(tags))
    );

    // handle the events
    this.subscriptions.add(this.eventState.getEvent$().subscribe((event) => this.onEvent(event)));
  }

  private getHierarchyObjectContext(
    contextId: CaHierarchyObjectContextId
  ): Observable<CaHierarchyObjectContext> {
    if (contextId.type !== 'hierarchyObject') {
      return of({ type: contextId.type });
    }
    return this.hierarchyObjectService
      .getHierarchyObject(contextId.hierarchyObjectId)
      .pipe(
        map((hierarchyObject) => ({ type: hierarchyObject.objectType, hierarchyObject: hierarchyObject }))
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

  public getHierarchyContext$(): Observable<CaHierarchyObjectContext> {
    return this.hierarchyObject$.pipe(filter((context) => context != null));
  }

  public getCurrentHierarchyContextId(): Promise<CaHierarchyObjectContextId> {
    return firstValueFrom(this.hierarchyObjectId$);
  }

  /**
   * Retrieve the ancestors from the current object to the root folder
   */
  public getAncestorsFolders$(): Observable<CaHierarchyObjectSimple[]> {
    return this.getHierarchyContext$().pipe(
      switchMap((hierarchyContext) => {
        if (hierarchyContext.hierarchyObject) {
          return this.folderTree.findAncestorsObject$(hierarchyContext.hierarchyObject.getFolderId());
        } else {
          return of([]);
        }
      })
    );
  }

  private getCurrentParentFolderId(): Promise<string | null> {
    return firstValueFrom(
      this.getHierarchyContext$().pipe(
        // the first element is the current object, we return the second element which is the parent
        map((context) => {
          return context.hierarchyObject?.parentId ?? null;
        })
      )
    );
  }

  public navigateToParentFolder(): void {
    this.getCurrentParentFolderId().then((parentFolderId) => {
      if (parentFolderId) {
        this.routerService.navigateToFolderDetail(parentFolderId);
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
    // if we add a folder to a parent folder where children are not loaded
    // we force to load all the children of parent folder
    // otherwise only this folder is added to parent folder but not its siblings
    const loadedParents: string[] = [];
    for (const object of folders) {
      const parent = this.folderTree.findNode(object.parentId);
      if (parent && !parent.childrenAreLoaded() && !loadedParents.includes(object.parentId)) {
        // load children of parent folder
        this.folderService
          .getChildFolders(object.parentId)
          .subscribe((children) => this.folderTree.addHierarchyObjects(children));
        loadedParents.push(object.parentId);
      }
    }

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
    return this.childrenTags;
  }

  private initTreeDrawerOpened(): void {
    // init tree open
    this.queryParamHandler.getFirstQueryParams().subscribe(
      // if the query param is not present, the tree is opened
      (params) => this.treeDrawerOpened$.next(params.showTree !== 'false')
    );
  }

  //////////////////////////////////// EVENTS /////////////////////////////////////

  private onEvent(event: CaHierarchyObjectEvent): void {
    if (event.hierarchyObjectType !== CaHierarchyObjectType.FOLDER) return;

    switch (event.action) {
      case 'update':
        this.updateFolder(event.hierarchyObjectId, event.hierarchyObject);
        break;
      case 'create':
        this.addFoldersInTree([event.hierarchyObject]);
        if (event.navigateToObject) {
          this.routerService.navigateToFolderDetail(event.hierarchyObjectId);
        }
        break;
      case 'delete':
        this.onFolderDelete(event.hierarchyObjectId);
        break;
    }
  }

  private onFolderDelete(folderId: string): void {
    this.deleteFolderInTree(folderId);

    const currentHierarchyObject = this.hierarchyObject$.value.hierarchyObject;
    if (currentHierarchyObject?.id === folderId) {
      this.navigateToParentFolder();
    }
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
