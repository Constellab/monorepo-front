import { Component, computed, inject, input, Signal } from '@angular/core';
import {
  CaHierarchyObject,
  CaHierarchyObjectType
} from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaDocumentBasicInfo } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import {
  CaDocumentActionEvent
} from '../../../ca-document-core/component/ca-document-actions-menu/ca-document-actions-menu.component';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import {
  CaFolderActionEvent
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-folder-actions-menu/ca-folder-actions-menu.component';
import { CaFolderInfo } from '../../../../../ca-core/model/entities/folder/ca-folder.class';

/**
 * Action menu to handle folder actions
 */
@Component({
  selector: 'ca-hierarchy-object-actions-menu',
  templateUrl: './ca-hierarchy-object-actions-menu.component.html',
  styleUrl: './ca-hierarchy-object-actions-menu.component.scss'
})
export class CaHierarchyObjectActionsMenuComponent {

  folder = input.required<CaHierarchyObject>();

  isDocument: Signal<boolean> = computed(() => this.folder().objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT ||
    this.folder().objectType === CaHierarchyObjectType.DOCUMENT);

  isFolder: Signal<boolean> = computed(() => this.folder().objectType === CaHierarchyObjectType.FOLDER);

  folderInfo: Signal<CaFolderInfo> = computed(() => {
    const folder = this.folder();
    return {
      id: folder.id,
      title: folder.name,
      leader: folder.user
    };
  });

  documentInfo: Signal<CaDocumentBasicInfo> = computed(() => {
    const folder = this.folder();
    return {
      id: folder.id,
      name: folder.name,
      isConstellabDocument: folder.objectType === CaHierarchyObjectType.CONSTELLAB_DOCUMENT,
      inTrash: false // if the folder is visible, it is not in trash
    };
  });

  state = inject(CaFolderDetailState);

  onFolderAction(event: CaFolderActionEvent): void {
    if (event.action === 'update') {
      this.state.updateFolder(event.folder);
    } else if (event.action === 'delete') {
      this.state.deleteFolder(event.folder.id);
    } else if (event.action === 'createChild') {
      this.state.addFolderChild(event.folder.hierarchyRepresentation);
    }
  }

  onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'update') {
      this.state.updatePartialFolderChild(event.document.id, { name: event.document.name });
    } else if (event.action === 'delete') {
      this.state.deleteFolder(this.folder().id);
    } else if (event.action === 'moveToTrash') {
      this.state.deleteFolder(event.document.id);
    } else if (event.action === 'moveToFolder') {
      this.state.deleteFolder(event.document.id);
    }
  }
}
