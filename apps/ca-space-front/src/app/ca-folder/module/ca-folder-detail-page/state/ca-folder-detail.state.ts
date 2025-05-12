import { inject, Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, Observable, switchMap } from 'rxjs';
import { CaFolder } from '../../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../../ca-core/service-api/ca-folder.service';
import { CaUser } from '../../../../ca-core/model/entities/ca-user.class';
import { map } from 'rxjs/operators';
import { FlArrayObs, FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';

import { ClSubscriptionHandler } from '@monorepo/core-lib';
import { CaHierarchyObjectDetailState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
} from '../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectSearchFields } from '../../../../ca-core/entity-module/ca-hierarchy-object-core/ca-hierarchy-object-search.class';
import { CaSecurityService } from '../../../../ca-core/service/ca-security.service';
import { CaFolderActionService } from '../../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import { CaHierarchyObjectSearchState } from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-search.state';
import {
  CaHierarchyObjectEvent,
  CaHierarchyObjectEventState,
} from '../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';

@Injectable()
export class CaFolderDetailState implements OnDestroy {
  private folderService = inject(CaFolderService);
  private folderActionService = inject(CaFolderActionService);
  private hierarchyObjectDetailState = inject(CaHierarchyObjectDetailState);
  private searchState = inject(CaHierarchyObjectSearchState);
  private securityService = inject(CaSecurityService);
  private eventState = inject(CaHierarchyObjectEventState);

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

    this.subscription.add(this.eventState.getEvent$().subscribe((event) => this.onEvent(event)));
  }

  private onEvent(event: CaHierarchyObjectEvent): void {
    if (event.action === 'updateFolder') {
      this.folder$.next(event.folder);
    }
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
