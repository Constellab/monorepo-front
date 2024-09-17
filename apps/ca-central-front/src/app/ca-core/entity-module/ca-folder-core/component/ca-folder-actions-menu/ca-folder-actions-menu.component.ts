import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaFolder, CaFolderInfo, CaFolderWithHierarchy } from '../../../../model/entities/folder/ca-folder.class';
import {
  CaFolderFormDialogComponent,
  CaFolderFormDialogInput
} from '../ca-folder-form-dialog/ca-folder-form-dialog.component';
import {
  CaUpdateFolderLeaderDialogComponent,
  CaUpdateFolderLeaderDialogInput
} from '../ca-update-folder-leader-dialog/ca-update-folder-leader-dialog.component';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../../service-api/ca-folder.service';
import { ClHelpService } from '@monorepo/core-lib';
import { CaRouterService } from '../../../../service/ca-router.service';

export type CaFolderActionEvent = {
  action: 'createChild';
  folder: CaFolderWithHierarchy;
} | {
  action: 'update';
  folder: CaFolder;
} | {
  action: 'delete';
  folder: CaFolderInfo;
}

/**
 * Action menu button to edit or a folder
 */
@Component({
  selector: 'ca-folder-actions-menu',
  templateUrl: './ca-folder-actions-menu.component.html',
  styleUrls: ['./ca-folder-actions-menu.component.scss']
})
export class CaFolderActionsMenuComponent {

  @Input({ required: true }) folderInfo: CaFolderInfo;

  @Input() stopClickEvent: boolean = false;

  @Output() folderAction: EventEmitter<CaFolderActionEvent> = new EventEmitter();

  constructor(private dialogService: FlDialogService,
              private folderService: CaFolderService) {
  }

  stopEvent(event: MouseEvent): void {
    if (this.stopClickEvent) {
      ClHelpService.stopEventPropagation(event);
    }
  }

  openUpdateFolderDialog(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'update',
      folderId: this.folderInfo.id
    };

    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      folder => this.updateDialogClosed(folder)
    );
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.folderAction.emit({
        action: 'update',
        folder: folder
      });
    }
  }

  openChildCreation(): void {
    const dialogInput: CaFolderFormDialogInput = {
      mode: 'create',
      parentId: this.folderInfo.id
    };

    this.dialogService.openSmallDialog(CaFolderFormDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      folder => this.createChildSuccess(folder)
    );
  }

  private createChildSuccess(folder: CaFolderWithHierarchy): void {
    if (folder) {
      this.folderAction.emit({
        action: 'createChild',
        folder: folder
      });
    }
  }

  openUpdateFolderLeaderDialog(): void {
    const dialogInput: CaUpdateFolderLeaderDialogInput = {
      folderId: this.folderInfo.id,
      currentLeader: this.folderInfo.leader,
      users$: this.folderService.getUsersOfFolder(this.folderInfo.id)
    };

    this.dialogService.openSmallDialog(CaUpdateFolderLeaderDialogComponent, {
      data: dialogInput
    }).afterClosed().subscribe(
      leader => this.onLeaderClosed(leader)
    );
  }

  private onLeaderClosed(folder: CaFolder): void {
    if (folder) {
      this.folderAction.emit({
        action: 'update',
        folder: folder
      });
    }
  }

  openDeleteFolderDialog(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_folder',
      content: 'delete_folder_confirm',
      translateTitleAndContent: true,
      observable: this.folderService.delete(this.folderInfo.id),
      successMessage: 'folder_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.folderAction.emit({
        action: 'delete',
        folder: this.folderInfo
      });
    }
  }

  get activityRoute(): string {
    return CaRouterService.getFolderActivityRoute(this.folderInfo.id);
  }

}
