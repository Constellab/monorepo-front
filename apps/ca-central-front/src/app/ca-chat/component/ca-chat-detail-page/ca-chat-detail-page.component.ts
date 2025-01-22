import { Component, computed, inject, Signal } from '@angular/core';
import { mergeMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CaUser } from '../../../ca-core/model/entities/ca-user.class';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { CaChatState } from '../ca-chat.state';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaHierarchyObjectWithChildren } from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectIconComponent } from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaUserListInlineComponent } from '../../../ca-core/entity-module/ca-user-core/component/ca-user-list-inline/ca-user-list-inline.component';
import { CaChatFolderComponent } from '../../../ca-core/entity-module/ca-chat-core/component/ca-chat-folder/ca-chat-folder.component';

/**
 * Page of a folder chat
 */
@Component({
  selector: 'ca-chat-detail-page',
  templateUrl: './ca-chat-detail-page.component.html',
  styleUrl: './ca-chat-detail-page.component.scss',
  imports: [CaHierarchyObjectIconComponent, CaUserListInlineComponent, CaChatFolderComponent],
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
