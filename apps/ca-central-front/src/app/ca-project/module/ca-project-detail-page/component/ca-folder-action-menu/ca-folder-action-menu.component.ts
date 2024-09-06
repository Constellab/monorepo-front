import { Component, computed, inject, input, Signal } from '@angular/core';
import { CaFolder, CaFolderObjectType } from '../../../../../ca-core/model/entities/project/ca-folder.class';
import { CaDocumentBasicInfo } from '../../../../../ca-core/model/entities/project/ca-document.class';
import {
  CaDocumentActionEvent
} from '../../../ca-document-core/component/ca-document-actions-menu/ca-document-actions-menu.component';
import { CaProjectDetailState } from '../../state/ca-project-detail.state';
import {
  CaProjectActionEvent
} from '../../../../../ca-core/entity-module/ca-project-core/component/ca-project-actions-menu/ca-project-actions-menu.component';
import { CaProjectInfo } from '../../../../../ca-core/model/entities/project/ca-project.class';

// TODO maybe to move to another folder
/**
 * Action menu to handle folder actions
 */
@Component({
  selector: 'ca-folder-action-menu',
  templateUrl: './ca-folder-action-menu.component.html',
  styleUrl: './ca-folder-action-menu.component.scss'
})
export class CaFolderActionMenuComponent {

  folder = input.required<CaFolder>();

  isDocument: Signal<boolean> = computed(() => this.folder().objectType === CaFolderObjectType.CONSTELLAB_DOCUMENT ||
    this.folder().objectType === CaFolderObjectType.DOCUMENT);

  isFolder: Signal<boolean> = computed(() => this.folder().objectType === CaFolderObjectType.FOLDER);

  projectInfo: Signal<CaProjectInfo> = computed(() => {
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
      isConstellabDocument: folder.objectType === CaFolderObjectType.CONSTELLAB_DOCUMENT,
      inTrash: false // if the folder is visible, it is not in trash
    };
  });

  state = inject(CaProjectDetailState);

  onProjectAction(event: CaProjectActionEvent): void {
    if (event.action === 'update') {
      this.state.updateProject(event.project);
    } else if (event.action === 'delete') {
      this.state.deleteFolder(event.project.id);
    } else if (event.action === 'createChild') {
      this.state.addFolderChild(event.project.folderHierarchy);
    }
  }

  onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'update') {
      this.state.updatePartialFolderChild(event.document.id, { name: event.document.name });
    } else if (event.action === 'delete') {
      this.state.deleteFolder(this.folder().id);
    } else if (event.action === 'moveToTrash') {
      this.state.deleteFolder(event.document.id);
    } else if (event.action === 'moveToProject') {
      this.state.deleteFolder(event.document.id);
    }
  }
}
