import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, first, Observable, of, switchMap } from 'rxjs';
import { CaFolder } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { map } from 'rxjs/operators';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import {
  FlArrayObs,
  FlEntityArrayObs,
  FlEntityPaginatedDatasource,
  FlSearchConfig,
  FlSearchState
} from '@monorepo/front-core-lib';
import { ClCoreJsonConvert, clGetEmptyPage, ClSubscriptionHandler } from '@monorepo/core-lib';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields
} from '../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';


@Injectable()
export class CaFolderDetailState implements OnDestroy {

  private id$: Observable<string>;

  private folder$: BehaviorSubject<CaFolder>;
  private users$: FlArrayObs<CaUser>;
  private childrenDatasource: CaHierarchyObjectDatasource;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private folderService: CaFolderService,
              private authenticatedUserService: CaAuthenticatedUserService,
              private hierarchyObjectDetailState: CaHierarchyObjectDetailState,
              private searchState: FlSearchState<CaHierarchyObject>) {
  }

  public init(id$: Observable<string>): void {
    this.id$ = id$;
    this.folder$ = new BehaviorSubject(null);

    this.subscription.add(this.id$.pipe(
      switchMap(id => this.folderService.getById(id))
    ).subscribe({
      next: folder => this.initFolder(folder),
      error: error => this.folder$.error(error)
    }));

    this.childrenDatasource = new FlEntityPaginatedDatasource<CaHierarchyObject>(
      () => of(clGetEmptyPage()), 30, false);

    this.users$ = new FlEntityArrayObs(this.id$.pipe(
      first(), // as the share is handle at the root folder level, not need to refresh it every time
      switchMap(id => this.folderService.getUsersOfFolder(id))
    ), true);

    // init the children search state
    const config: FlSearchConfig = {
      version: 1,
      buildAdvancedForm: CaHierarchyObjectSearch.getAdvancedSearchForm,
      advancedFormClass: CaHierarchyObjectSearchFields,
      savedSearch: [],
      advancedFormManager: {
        config: CaHierarchyObjectSearch.advancedSearchManagerConfig,
        skipFalseBoolean: true
      },
      storeSearchInUrl: true
    };
    this.searchState.init(config, this.childrenDatasource);
  }

  private initFolder(folder: CaFolder): void {
    // update the folder id in the search function
    this.childrenDatasource.setPageFunction((page, pageSize, requestData) =>
      this.folderService.searchChildren(folder.id, page, pageSize, requestData)
    );

    // if this is not the first get (navigation between folder), reset the search form
    if (this.folder$.value) {
      // reset the search form and prevent event so the valueChange is not triggered
      this.searchState.resetFormAndCallSearch({ emitEvent: false });
    } else {
      // trigger the first search using form value
      this.searchState.callAdvancedSearchFromForm();
    }

    this.folder$.next(folder);
  }

  public getFolderId$(): Observable<string> {
    return this.id$;
  }

  public getCurrentFolder(): CaFolder | null {
    return this.folder$.value;
  }

  public getFolder$(skipNull: boolean = true): Observable<CaFolder> {
    return this.folder$.asObservable().pipe(
      filter(folder => !skipNull || folder != null)
    );
  }

  public isRootFolder$(): Observable<boolean> {
    return this.hierarchyObjectDetailState.getAncestorsFolders$().pipe(
      // using 1 because the current folder is in the ancestors
      map(ancestors => ancestors.length <= 1)
    );
  }

  public getUsers(): FlArrayObs {
    return this.users$;
  }

  public canEditFolder$(): Observable<boolean> {
    const user = this.authenticatedUserService.getCurrentUser();

    return this.getFolder$(false).pipe(
      map(folder => this.authenticatedUserService.isCurrentSpaceAdmin() ||
        (folder != null && folder.leader.id === user.id))
    );
  }

  public getChildrenDatasource(): CaHierarchyObjectDatasource {
    return this.childrenDatasource;
  }


  public updateFolder(folder: CaFolder): void {
    if (this.getCurrentFolder().id === folder.id) {
      this.folder$.next(folder);
    }
    this.updatePartialChild(folder.id, { name: folder.name, user: folder.leader });
  }

  public addChild(folder: CaHierarchyObject): void {
    if (folder.parentId === this.getCurrentFolder().id) {
      this.childrenDatasource.unshiftItem(folder);
    }
    this.hierarchyObjectDetailState.addFolderInTree(folder);
  }

  public updatePartialChild(hierarchyObjectId: string, hierarchyObject: Partial<CaHierarchyObject>): void {
    const childFolder = this.childrenDatasource.findItemById(hierarchyObjectId);
    if (childFolder) {
      // create a new folder based on the old one and the new data
      const cloned = ClCoreJsonConvert.deepCloneClassAndMerge(childFolder, hierarchyObject, CaHierarchyObject);
      this.childrenDatasource.updateItem(cloned);
    }

    this.hierarchyObjectDetailState.updateFolder(hierarchyObjectId, hierarchyObject);
  }

  public deleteHierarchyObject(id: string): void {
    // delete folder if it is in the children
    const folder = this.childrenDatasource.findItemById(id);
    if (folder) {
      this.childrenDatasource.removeItemById(id);
    }

    // delete folder in the tree
    this.hierarchyObjectDetailState.deleteFolderInTree(id);

    // if the delete folder is the current folder, navigate to the parent folder
    if (id === this.getCurrentFolder().id) {
      this.hierarchyObjectDetailState.navigateToParentFolder();
    }
  }

  ngOnDestroy(): void {
    this.folder$?.complete();
    this.users$?.disconnect();
    this.childrenDatasource?.manualDisconnect();
    this.subscription?.unsubscribe();
  }


}
