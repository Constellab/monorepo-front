import { inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlRouterHelper } from '@monorepo/front-core-lib/fl-core';
import { first, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CaChatFolder,
  CaHierarchyObjectsTreeDatasource,
} from '../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaRouterService } from '../../ca-core/service/ca-router.service';
import { CaChatService } from '../../ca-core/service-api/ca-chat.service';

/**
 * Global state for the chat page
 */
@Injectable()
export class CaChatState {
  private chatService = inject(CaChatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private routerService = inject(CaRouterService);

  private folders: CaHierarchyObjectsTreeDatasource;
  private isLoadingSignal: WritableSignal<boolean>;

  public folderId$: Observable<string>;

  public init(): void {
    this.folders = new CaHierarchyObjectsTreeDatasource();
    this.isLoadingSignal = signal(true);
    this.folderId$ = FlRouterHelper.listenToChildrenParams(this.router, this.route).pipe(
      map((params) => params.id)
    );
    this.chatService.getChatRootFolders().subscribe({
      next: (folders) => this.getFolderTreeSuccess(folders),
      error: () => this.isLoadingSignal.set(false),
    });
  }

  public getFolders(): CaHierarchyObjectsTreeDatasource {
    return this.folders;
  }

  public get isLoading(): Signal<boolean> {
    return this.isLoadingSignal;
  }

  private getFolderTreeSuccess(folders: CaChatFolder[]): void {
    this.folders.addHierarchyObjectsWithChildren(folders);

    // if there is not selected folder, select the first one
    this.folderId$.pipe(first()).subscribe((folderId) => {
      if (folders.length === 0) return;

      // if a folder is selected, we check that it exists and is a chat folder
      if (folderId) {
        let found = false;
        for (const folder of folders) {
          const folderWithChat = folder.getById(folderId);
          if (folderWithChat && folderWithChat.chatEnabled) {
            found = true;
            break;
          }
        }
        // if the selected folder is not a chat folder, we select the first one
        if (!found) {
          this.selectFirstFolder(folders);
        }
      } else {
        // if no folder is selected, we select the first one
        this.selectFirstFolder(folders);
      }
    });

    this.isLoadingSignal.set(false);
  }

  private selectFirstFolder(folders: CaChatFolder[]): void {
    for (const folder of folders) {
      const folderWithChat = folder.getFirstWithChatEnabled();
      if (folderWithChat) {
        this.routerService.navigateToChatFolder(folderWithChat.id, { replaceUrl: true });
        return;
      }
    }
  }

  public getSelectedFolderId$(): Observable<string> {
    return this.folderId$;
  }
}
