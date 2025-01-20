import { Component, computed, inject, Signal } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { CaChatState } from '../ca-chat.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaHierarchyObjectWithChildren } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';

/**
 * Page of a folder chat
 */
@Component({
    selector: 'ca-chat-detail-page',
    templateUrl: './ca-chat-detail-page.component.html',
    styleUrl: './ca-chat-detail-page.component.scss',
    standalone: false
})
export class CaChatDetailPageComponent {
  private state = inject(CaChatState);

  folderId: Signal<string> = toSignal(this.state.folderId$);

  folder = computed(() => this.getFolder(this.folderId(), this.state.folders()));

  users$: Observable<CaUser[]> = this.state
    .getSelectedFolderId$()
    .pipe(mergeMap((folderId) => this.folderService.getUsersOfFolder(folderId)));

  private folderService = inject(CaFolderService);

  private getFolder(id: string, folders: CaHierarchyObjectWithChildren[]): CaHierarchyObjectWithChildren {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder;
      }

      const found = this.getFolder(id, folder.children);
      if (found) {
        return found;
      }
    }

    return null;
  }
}
