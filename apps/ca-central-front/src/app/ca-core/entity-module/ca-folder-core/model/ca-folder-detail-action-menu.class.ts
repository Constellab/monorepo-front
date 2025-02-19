import { CaFolderRightPanelState } from '../../../../ca-folder/module/ca-folder-detail-page/state/ca-folder-right-panel.state';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { CaFolderInfo } from '../../../model/entities/folder/ca-folder.class';
import { CaFolderActionEvent, CaFolderActionsMenu } from './ca-folder-actions-menu.class';
import { CaRouterService } from '../../../service/ca-router.service';
import { Observable, Subject } from 'rxjs';
import {
  CaDocumentTrashListDialogComponent,
  CaDocumentTrashListDialogInput,
} from '../../../../ca-folder/module/ca-folder-detail-page/component/ca-document-trash-list-dialog/ca-document-trash-list-dialog.component';
import { CaDocument } from '../../../model/entities/folder/ca-document.class';
import { CaSecurityService } from '../../../service/ca-security.service';
import {
  CaFolderSharedGroupsListInput,
  CaFolderSharedListComponent,
} from '../../../../ca-folder/module/ca-folder-detail-page/component/ca-folder-shared-list/ca-folder-shared-list.component';
import { CaUser } from '../../../model/entities/ca-user.class';
import {
  CaFolderUserConfigDialogComponent,
  CaFolderUserConfigDialogInput,
} from '../../../../ca-folder/module/ca-folder-detail-page/component/ca-folder-user-config-dialog/ca-folder-user-config-dialog.component';
import { CaFolderActionService } from '../ca-folder-action.service';
import { CaHierarchyObjectActionTags } from '../../../../ca-folder/module/ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

export type CaFolderDetailActionEvent =
  | CaFolderActionEvent
  | {
      action: 'restoreFileFromTrash';
    };

/**
 * Action menu for the current folder in folder detail page
 */
export class CaFolderDetailActionMenu extends CaFolderActionsMenu {
  protected subject: Subject<any> = new Subject();

  constructor(
    dialogService: FlDialogService,
    folderActionService: CaFolderActionService,
    menuDynamicService: FlMenuDynamicService,
    securityService: CaSecurityService,
    private rightPanelState: CaFolderRightPanelState,
    folderInfo: CaFolderInfo,
    private isRootFolder: boolean,
    private folderUsers$: FlArrayObs<CaUser>,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(dialogService, folderActionService, menuDynamicService, securityService, folderInfo, tags);
  }

  public openDetailActionMenu(event: MouseEvent): Observable<CaFolderDetailActionEvent> {
    const menus: FlMenuDynamic[] = [this.getManageTagsButton()];

    if (this.isRootFolder) {
      if (this.canEditFolder()) {
        menus.push(this.getShareButton());
      }
      menus.push(this.getUserConfigButton());
    }

    menus.push(this.getActivitiesButton());
    menus.push(this.getDocumentInTrashButton(), this.getOpenSettingsButton());

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
    const input: CaFolderSharedGroupsListInput = {
      folderId: this.folderInfo.id,
      canEdit: this.canEditFolder(),
      users$: this.folderUsers$,
    };

    this.dialogService.openSmallDialog(CaFolderSharedListComponent, { data: input, autoFocus: false });
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

    this.dialogService.openMediumDialog(CaFolderUserConfigDialogComponent, { data: dialogInput });
  }

  private getActivitiesButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'activities', translateText: true },
      icon: 'task',
      link: CaRouterService.getFolderActivityRoute(this.folderInfo.id),
    };
  }

  private getOpenSettingsButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'folder_settings', translateText: true },
      icon: 'settings',
      onClick: () => this.openSettings(),
    };
  }

  private openSettings(): void {
    this.rightPanelState.updateRightPanelState({ type: 'settings', objectId: this.folderInfo.id });
    this.subject.complete();
  }

  private getDocumentInTrashButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'documents_in_trash', translateText: true },
      icon: 'delete',
      onClick: () => this.openDocumentInTrash(),
    };
  }

  private openDocumentInTrash(): void {
    const input: CaDocumentTrashListDialogInput = {
      folderId: this.folderInfo.id,
    };

    this.dialogService
      .openMediumDialog(CaDocumentTrashListDialogComponent, { data: input, autoFocus: false })
      .afterClosed()
      .subscribe((restoredDocs) => this.onDocumentInTrashClosed(restoredDocs));
  }

  private onDocumentInTrashClosed(restoredDocs?: CaDocument[]): void {
    if (restoredDocs?.length > 0) {
      this.emitEvent({ action: 'restoreFileFromTrash' });
    }
    this.subject.complete();
  }

  private emitEvent(event: CaFolderDetailActionEvent): void {
    this.subject.next(event);
  }
}
