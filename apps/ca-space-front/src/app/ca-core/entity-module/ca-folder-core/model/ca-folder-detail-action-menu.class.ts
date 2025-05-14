import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaFolderInfo } from '../../../model/entities/folder/ca-folder.class';
import { CaFolderActionEvent, CaFolderActionsMenu } from './ca-folder-actions-menu.class';
import { CaRouterService } from '../../../service/ca-router.service';
import { Observable } from 'rxjs';
import {
  CaFolderUserConfigDialogComponent,
  CaFolderUserConfigDialogInput,
} from '../../../../ca-folder/module/ca-folder-detail-page/component/ca-folder-user-config-dialog/ca-folder-user-config-dialog.component';
import { CaHierarchyObjectActionTags } from '../../../../ca-folder/module/ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import {
  CaHierarchyObjectTrashDialogComponent,
  CaHierarchyObjectTrashDialogInput,
} from '../../../../ca-folder/module/ca-hierarchy-object-detail-page/ca-hierarchy-object-trash-dialog/ca-hierarchy-object-trash-dialog.component';
import { CaHierarchyObject } from '../../../model/entities/folder/ca-hierarchy-object.class';
import {
  CaFolderUsersDialogComponent,
  CaFolderUsersDialogInput,
} from '../../../../ca-folder/module/ca-folder-detail-page/component/ca-folder-users-dialog/ca-folder-users-dialog.component';

export type CaFolderDetailActionEvent =
  | CaFolderActionEvent
  | {
      action: 'restoreObjectFromTrash';
      hierarchyObjects: CaHierarchyObject[];
    };

/**
 * Action menu for the current folder in folder detail page
 */
export class CaFolderDetailActionMenu extends CaFolderActionsMenu {
  constructor(
    injector: Injector,
    folderInfo: CaFolderInfo,
    private isRootFolder: boolean,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, folderInfo, tags);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<CaFolderDetailActionEvent> {
    const menus: FlMenuDynamic[] = [];

    if (this.folderInfo.userRole.canEdit()) {
      menus.push(this.getManageTagsButton());
    }

    if (this.isRootFolder) {
      if (this.folderInfo.userRole.isOwner()) {
        menus.push(this.getShareButton());
      }
      menus.push(this.getUserConfigButton());
    }

    menus.push(this.getActivitiesButton());

    if (this.folderInfo.userRole.canEdit()) {
      menus.push(this.getObjectInTrash(), this.getOpenSettingsButton());
    }

    return this.generateMenu(menus, event);
  }

  private getShareButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'share', translateText: true },
      icon: 'folder_shared_groups',
      onClick: () => this.openShareDialog(),
    };
  }

  private openShareDialog(): void {
    const input: CaFolderUsersDialogInput = {
      folderId: this.folderInfo.id,
    };

    this.injector.get(FlDialogService).openMediumDialog(CaFolderUsersDialogComponent, {
      data: input,
      autoFocus: false,
    });
  }

  private getUserConfigButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'folder_configure_notifications', translateText: true },
      icon: 'notifications',
      onClick: () => this.openUserConfigDialog(),
    };
  }

  private openUserConfigDialog(): void {
    const dialogInput: CaFolderUserConfigDialogInput = {
      folderId: this.folderInfo.id,
    };

    this.injector
      .get(FlDialogService)
      .openMediumDialog(CaFolderUserConfigDialogComponent, { data: dialogInput });
  }

  private getActivitiesButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'activities', translateText: true },
      icon: 'task',
      link: CaRouterService.getFolderActivityRoute(this.folderInfo.id),
    };
  }

  private getObjectInTrash(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'objects_in_trash', translateText: true },
      icon: 'delete',
      onClick: () => this.openObjectsInTrash(),
    };
  }

  private openObjectsInTrash(): void {
    const input: CaHierarchyObjectTrashDialogInput = {
      mode: 'folder',
      folderId: this.folderInfo.id,
      folderName: this.folderInfo.name,
    };

    this.injector
      .get(FlDialogService)
      .openMediumDialog(CaHierarchyObjectTrashDialogComponent, {
        data: input,
        autoFocus: false,
        injector: this.injector,
      })
      .afterClosed()
      .subscribe((restoredDocs) => this.onDocumentInTrashClosed(restoredDocs));
  }

  private onDocumentInTrashClosed(restoredDocs?: CaHierarchyObject[]): void {
    if (restoredDocs?.length > 0) {
      this.emitEvent({ action: 'restoreObjectFromTrash', hierarchyObjects: restoredDocs });
    }
    this.subject.complete();
  }

  private emitEvent(event: CaFolderDetailActionEvent): void {
    this.subject.next(event);
  }
}
