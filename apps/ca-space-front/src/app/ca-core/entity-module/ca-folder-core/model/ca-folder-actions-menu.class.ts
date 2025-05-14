import {
  CaFolder,
  CaFolderInfo,
  CaFolderWithHierarchy,
} from '../../../model/entities/folder/ca-folder.class';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';

import { Observable } from 'rxjs';
import { CaConstellabDocument } from '../../../model/entities/folder/ca-document.class';
import { CaRouterService } from '../../../service/ca-router.service';
import { CaFolderActionService } from '../ca-folder-action.service';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
  CaHierarchyObjectMoveToFolderAction,
  CaHierarchyObjectMoveToTrashAction,
} from '../../../../ca-folder/module/ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { CaFolderRightPanelState } from '../../../../ca-folder/module/ca-folder-detail-page/state/ca-folder-right-panel.state';

export type CaFolderActionEvent =
  | {
      action: 'createChild';
      folder: CaFolderWithHierarchy;
    }
  | {
      action: 'update';
      folder: CaFolder;
    }
  | {
      action: 'createConstellabDocument';
      document: CaConstellabDocument;
    }
  | CaHierarchyObjectMoveToTrashAction
  | CaHierarchyObjectMoveToFolderAction;

export class CaFolderActionsMenu extends CaHierarchyObjectBaseActionMenu {
  constructor(
    injector: Injector,
    protected folderInfo: CaFolderInfo,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, folderInfo.id, tags);
  }

  /**
   * Open the action menu for the folder in the table
   */
  public openTableItemActionMenu(
    event: MouseEvent,
    disableMove: boolean = false
  ): Observable<CaFolderActionEvent> {
    const menu: FlMenuDynamic[] = [this.getOpenFolderButton()];

    if (this.folderInfo.userRole.canEdit()) {
      menu.push(this.getManageTagsButton(), this.getUpdateFolderButton());
      if (!disableMove) {
        menu.push(this.getMoveToFolderButton());
      }
      menu.push(this.getOpenSettingsButton(), this.getMoveToTrashButton());
    }

    return this.generateMenu(menu, event);
  }

  /**
   * Open the action menu when right-click on the folder children section
   */
  public openFolderChildrenActionMenu(event: MouseEvent): Observable<CaFolderActionEvent> {
    const menu: FlMenuDynamic[] = [];

    if (this.folderInfo.userRole.canEdit()) {
      menu.push(this.getCreateChildButton(), {
        type: 'button',
        text: { text: 'create_constellab_document', translateText: true },
        icon: 'constellab_document',
        onClick: () => this.createConstellabDocument(),
      });
    }

    return this.generateMenu(menu, event);
  }

  protected getCreateChildButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'create_sub_folder', translateText: true },
      icon: 'folder',
      onClick: () => this.openChildCreation(),
    };
  }

  protected getOpenFolderButton(): FlMenuDynamic {
    return {
      type: 'link',
      text: { text: 'open_folder', translateText: true },
      icon: 'folder',
      link: CaRouterService.getFolderDetailRoute(this.folderInfo.id),
    };
  }

  protected getUpdateFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'update_folder', translateText: true },
      icon: 'edit',
      onClick: () => this.openUpdateFolderDialog(),
    };
  }

  protected getOpenSettingsButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'folder_settings', translateText: true },
      icon: 'settings',
      onClick: () => this.openSettings(),
    };
  }

  private openUpdateFolderDialog(): void {
    this.injector
      .get(CaFolderActionService)
      .openUpdateFolderDialog(this.folderInfo.id)
      .subscribe((folder) => this.updateDialogClosed(folder));
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'update',
        folder: folder,
      } as CaFolderActionEvent);
    }
    this.subject.complete();
  }

  private openChildCreation(): void {
    this.injector
      .get(CaFolderActionService)
      .openChildCreation(this.folderInfo.id)
      .subscribe((folder) => this.createChildSuccess(folder));
  }

  private createChildSuccess(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'createChild',
        folder: folder,
      } as CaFolderActionEvent);
    }
    this.subject.complete();
  }

  private createConstellabDocument(): void {
    this.injector
      .get(CaFolderActionService)
      .createConstellabDocument(this.folderInfo.id)
      .subscribe((doc: CaConstellabDocument) => this.createConstellabDocClosed(doc));
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.subject.next({
        action: 'createConstellabDocument',
        document: doc,
      } as CaFolderActionEvent);
    }
    this.subject.complete();
  }

  private openSettings(): void {
    this.injector.get(CaFolderRightPanelState).updateRightPanelState({
      type: 'settings',
      objectId: this.folderInfo.id,
    });
    this.subject.complete();
  }
}
