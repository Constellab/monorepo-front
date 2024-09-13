import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, filter, first, Observable, of, switchMap } from 'rxjs';
import { CaFolder } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { map } from 'rxjs/operators';
import { CaAuthenticatedUserService } from '../../../../ca-core/service-api/ca-authenticated-user.service';
import { FlArrayObs, FlEntityArrayObs, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { ClCoreJsonConvert, clGetEmptyPage, ClSubscriptionHandler } from '@monorepo/core-lib';
import {
  CaHierarchyObjectDetailState
} from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { TeRichTextContent } from '@monorepo/text-editor';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectSearchFields } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';

interface CaSearchChildrenData {
  parentId: string;
  filters: Partial<CaHierarchyObjectSearchFields>;
}

@Injectable()
export class CaFolderDetailState implements OnDestroy {

  private id$: Observable<string>;

  private folder$: BehaviorSubject<CaFolder>;
  private users$: FlArrayObs<CaUser>;
  private childrenDatasource: CaHierarchyObjectDatasource;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  constructor(private folderService: CaFolderService,
              private authenticatedUserService: CaAuthenticatedUserService,
              private hierarchyObjectDetailState: CaHierarchyObjectDetailState) {
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
      (page, pageSize, requestData: CaSearchChildrenData) => {
        if (!requestData) return of(clGetEmptyPage());
        return this.folderService.searchChildren(requestData.parentId, page, pageSize, requestData.filters);
      }, 30, false);

    this.users$ = new FlEntityArrayObs(this.id$.pipe(
      first(), // as the share is handle at the root folder level, not need to refresh it every time
      switchMap(id => this.folderService.getUsersOfFolder(id))
    ), true);

  }

  private initFolder(folder: CaFolder): void {
    this.folder$.next(folder);
    const data: CaSearchChildrenData = { parentId: folder.id, filters: {} };
    this.childrenDatasource.getFirstPage(data);
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

  public updateDescription(description: TeRichTextContent): void {
    const folder = this.getCurrentFolder();
    this.folderService.updateDescription(folder.id, description as any).subscribe();
  }

  public getChildrenDatasource(): CaHierarchyObjectDatasource {
    return this.childrenDatasource;
  }

  public addFolderChild(folder: CaHierarchyObject): void {
    if (folder.parentId === this.getCurrentFolder().id) {
      this.childrenDatasource.unshiftItem(folder);
    }
    this.hierarchyObjectDetailState.addFolderInTree(folder);
  }

  public updateFolder(folder: CaFolder): void {
    if (this.getCurrentFolder().id === folder.id) {
      this.folder$.next(folder);
    }
    this.updatePartialFolderChild(folder.id, { name: folder.title, user: folder.leader });
  }

  public updatePartialFolderChild(folderId: string, folder: Partial<CaHierarchyObject>): void {
    const childFolder = this.childrenDatasource.findItemById(folderId);
    if (childFolder) {
      // create a new folder based on the old one and the new data
      const cloned = ClCoreJsonConvert.deepCloneClassAndMerge(childFolder, folder, CaHierarchyObject);
      this.childrenDatasource.updateItem(cloned);
    }

    this.hierarchyObjectDetailState.updateFolder(folderId, folder);
  }

  public deleteFolder(id: string): void {
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

  public filterChildren(filters: Partial<CaHierarchyObjectSearchFields>): void {
    const data: CaSearchChildrenData = this.childrenDatasource.getRequestData();
    const newData = Object.assign({}, data, { filters });
    this.childrenDatasource.getFirstPage(newData);
  }


  ngOnDestroy(): void {
    this.folder$?.complete();
    this.users$?.disconnect();
    this.childrenDatasource?.manualDisconnect();
    this.subscription?.unsubscribe();
  }


}
