import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable, switchMap } from 'rxjs';
import { CaFolder } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { map } from 'rxjs/operators';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';

import { ClCoreJsonConvert, ClSubscriptionHandler } from '@monorepo/core-lib';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectSearchFields } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import { CaSecurityService } from '../../../../ca-core/service/ca-security.service';
import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { CaHierarchyObjectSearchState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';

@Injectable()
export class CaFolderDetailState implements OnDestroy {
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);
  private hierarchyObjectDetailState = inject(CaHierarchyObjectDetailState);
  private searchState = inject(CaHierarchyObjectSearchState);
  private securityService = inject(CaSecurityService);

  private id$: Observable<string>;

  private folder$: BehaviorSubject<CaFolder>;
  private users$: FlArrayObs<CaUser>;

  private subscription: ClSubscriptionHandler = new ClSubscriptionHandler();

  public init(id$: Observable<string>): void {
    this.id$ = id$;
    this.folder$ = new BehaviorSubject(null);

    this.subscription.add(
      this.id$.pipe(switchMap((id) => this.folderService.getById(id))).subscribe({
        next: (folder) => this.initFolder(folder),
        error: (error) => this.folder$.error(error),
      })
    );

    const rootFolderId$ = this.hierarchyObjectDetailState.getRootFolder$().pipe(
      map((folder) => folder.id),
      distinctUntilChanged()
    );
    this.users$ = new FlEntityArrayObs(
      rootFolderId$.pipe(switchMap((id) => this.folderService.getUsersOfFolder(id))),
      true
    );

    this.subscription.add(
      this.folderActionService
        .getUploadedDocumentActionResult()
        .subscribe((document) => this.onDocumentUploaded(document.document, document.folderId))
    );

    this.subscription.add(
      this.folderActionService
        .getUploadedFolderActionResult()
        .subscribe((event) => this.onFolderUploaded(event.parentFolderId))
    );
  }

  public getFolderId$(): Observable<string> {
    return this.id$;
  }

  public getCurrentFolder(): CaFolder | null {
    return this.folder$.value;
  }

  public getFolder$(skipNull: boolean = true): Observable<CaFolder> {
    return this.folder$.asObservable().pipe(filter((folder) => !skipNull || folder != null));
  }

  public isRootFolder$(): Observable<boolean> {
    return this.hierarchyObjectDetailState.getAncestorsFolders$().pipe(
      // using 1 because the current folder is in the ancestors
      map((ancestors) => ancestors.length <= 1)
    );
  }

  public getUsers(): FlArrayObs<CaUser> {
    return this.users$;
  }

  public canEditFolder$(): Observable<boolean> {
    return this.getFolder$(false).pipe(
      map((folder) => this.securityService.canEditFolder(folder?.leader.id))
    );
  }

  public get childrenDatasource(): CaHierarchyObjectDatasource<CaHierarchyObjectSearchFields> {
    return this.searchState.childrenDatasource;
  }

  public refreshChildren(): void {
    this.childrenDatasource.getFirstPage();
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
    this.hierarchyObjectDetailState.addFoldersInTree([folder]);
  }

  public updatePartialChild(hierarchyObjectId: string, hierarchyObject: Partial<CaHierarchyObject>): void {
    const childFolder = this.childrenDatasource.findItemById(hierarchyObjectId);
    if (childFolder) {
      // create a new folder based on the old one and the new data
      const cloned = ClCoreJsonConvert.deepCloneClassAndMerge(
        childFolder,
        hierarchyObject,
        CaHierarchyObject
      );
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

  private initFolder(folder: CaFolder): void {
    this.folder$.next(folder);
  }

  private onDocumentUploaded(hierarchyObject: CaHierarchyObject, folderId: string): void {
    const currentFolderId = this.folder$.value?.id;
    if (currentFolderId !== folderId) return;
    this.childrenDatasource.unshiftItem(hierarchyObject);
  }

  private onFolderUploaded(parentFolderId: string): void {
    const currentFolderId = this.folder$.value?.id;
    if (currentFolderId !== parentFolderId) return;
    // reload the datasource
    this.childrenDatasource.getFirstPage();
  }

  ngOnDestroy(): void {
    this.folder$?.complete();
    this.users$?.disconnect();
    this.subscription?.unsubscribe();
  }
}
