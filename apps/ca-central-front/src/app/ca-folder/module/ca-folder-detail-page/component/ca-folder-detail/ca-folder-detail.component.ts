import { Component, ViewContainerRef } from '@angular/core';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import { FlDialogService, FlMenuDynamicService } from '@monorepo/front-core-lib';
import { CaFolderDetailState } from '../../state/ca-folder-detail.state';
import { Observable } from 'rxjs';
import {
  CaFolderSharedGroupsListInput,
  CaFolderSharedListComponent
} from '../ca-folder-shared-list/ca-folder-shared-list.component';
import {
  CaFolderUserConfigDialogComponent,
  CaFolderUserConfigDialogInput
} from '../ca-folder-user-config-dialog/ca-folder-user-config-dialog.component';
import { CaFolderRightPanelState } from '../../state/ca-folder-right-panel.state';
import { CaHierarchyObjectType } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import {
  CaFolderActionEvent,
  CaFolderActionsMenu
} from '../../../../../ca-core/entity-module/ca-folder-core/model/ca-folder-actions-menu.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';

/**
 * Show detailed information for a folder , used in FolderDetailPage
 */
@Component({
  selector: 'ca-folder-detail',
  templateUrl: './ca-folder-detail.component.html',
  styleUrls: ['./ca-folder-detail.component.scss']
})
export class CaFolderDetailComponent {

  folderId$: Observable<string> = this.state.getFolderId$();
  folder$: Observable<CaFolder> = this.state.getFolder$();

  isRootFolder$: Observable<boolean> = this.state.isRootFolder$();
  canEditFolder$: Observable<boolean> = this.state.canEditFolder$();

  folderObjectType = CaHierarchyObjectType.FOLDER;

  constructor(private dialogService: FlDialogService,
              private state: CaFolderDetailState,
              private rightPanelState: CaFolderRightPanelState,
              private viewContainerRef: ViewContainerRef,
              private menuDynamicService: FlMenuDynamicService,
              private folderService: CaFolderService) {
  }

  openFolderActionMenu(folder: CaFolder, event: MouseEvent): void {
    const folderActionsMenu = new CaFolderActionsMenu(this.dialogService, this.folderService,
      this.menuDynamicService, {
        id: folder.id,
        name: folder.name,
        leader: folder.leader
      });

    folderActionsMenu.openTableItemActionMenu(event).subscribe(event => {
      this.onFolderAction(event);
    });
  }

  private onFolderAction(folderEvent: CaFolderActionEvent): void {
    if(!folderEvent) return;
    if (folderEvent.action === 'update') {
      this.state.updateFolder(folderEvent.folder);
    } else if (folderEvent.action === 'delete') {
      this.state.deleteHierarchyObject(folderEvent.folder.id);
    } else if (folderEvent.action === 'createChild') {
      this.state.addChild(folderEvent.folder.hierarchyRepresentation);
    }
  }

  openShareDialog(folder: CaFolder): void {
    const input: CaFolderSharedGroupsListInput = {
      folderId: folder.id,
      canEdit$: this.state.canEditFolder$()
    };

    this.dialogService.openSmallDialog(CaFolderSharedListComponent,
      { data: input, viewContainerRef: this.viewContainerRef, autoFocus: false });
  }

  openUserConfigDialog(folder: CaFolder): void {
    const dialogInput: CaFolderUserConfigDialogInput = {
      folderId: folder.id
    };

    this.dialogService.openMediumDialog(CaFolderUserConfigDialogComponent, { data: dialogInput });
  }

  openDescription(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'description', objectId: folder.id });
  }

  openChat(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'chat', objectId: folder.id });
  }

  openSettings(folder: CaFolder): void {
    this.rightPanelState.updateRightPanelState({ type: 'settings', objectId: folder.id });
  }
}
