import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CaHierarchyObjectWithChildren } from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderService } from '../../ca-core/service-api/ca-folder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlRouterHelper } from '@monorepo/front-core-lib';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

/**
 * Global state for the chat page
 */
@Injectable()
export class CaChatState {

  private hierarchyObjects: WritableSignal<CaHierarchyObjectWithChildren[]>;

  public folderId$: Observable<string>;

  constructor(private folderService: CaFolderService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  public init(): void {
    this.hierarchyObjects = signal([]);
    this.folderId$ = FlRouterHelper.listenToChildrenParams(this.router, this.route)
      .pipe(
        map(params => params.id)
      );
    this.folderService.getChatRootFolders().subscribe(
      folders => this.getFolderTreeSuccess(folders)
    );
  }

  public get folders(): Signal<CaHierarchyObjectWithChildren[]> {
    return this.hierarchyObjects;
  }

  private getFolderTreeSuccess(folders: CaHierarchyObjectWithChildren[]): void {
    this.hierarchyObjects.set(folders);
  }

  public getSelectedFolderId$(): Observable<string> {
    return this.folderId$;
  }
}
