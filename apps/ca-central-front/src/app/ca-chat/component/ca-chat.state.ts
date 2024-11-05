import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { CaHierarchyObjectWithChildren } from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaFolderService } from '../../ca-core/service-api/ca-folder.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FlRouterHelper } from '@monorepo/front-core-lib';
import { map } from 'rxjs/operators';
import { first, Observable } from 'rxjs';
import { CaRouterService } from '../../ca-core/service/ca-router.service';

/**
 * Global state for the chat page
 */
@Injectable()
export class CaChatState {
  private folderSignal: WritableSignal<CaHierarchyObjectWithChildren[]>;
  private isLoadingSignal: WritableSignal<boolean>;

  public folderId$: Observable<string>;

  constructor(
    private folderService: CaFolderService,
    private route: ActivatedRoute,
    private router: Router,
    private routerService: CaRouterService
  ) {}

  public init(): void {
    this.folderSignal = signal([]);
    this.isLoadingSignal = signal(true);
    this.folderId$ = FlRouterHelper.listenToChildrenParams(this.router, this.route).pipe(
      map((params) => params.id)
    );
    this.folderService.getChatRootFolders().subscribe({
      next: (folders) => this.getFolderTreeSuccess(folders),
      error: () => this.isLoadingSignal.set(false),
    });
  }

  public get folders(): Signal<CaHierarchyObjectWithChildren[]> {
    return this.folderSignal;
  }

  public get isLoading(): Signal<boolean> {
    return this.isLoadingSignal;
  }

  private getFolderTreeSuccess(folders: CaHierarchyObjectWithChildren[]): void {
    this.folderSignal.set(folders);

    // if there is not selected folder, select the first one
    this.folderId$.pipe(first()).subscribe((folderId) => {
      if (!folderId && folders.length > 0) {
        this.routerService.navigateToChatFolder(folders[0].id, { replaceUrl: true });
      }
    });
    this.isLoadingSignal.set(false);
  }

  public getSelectedFolderId$(): Observable<string> {
    return this.folderId$;
  }
}
