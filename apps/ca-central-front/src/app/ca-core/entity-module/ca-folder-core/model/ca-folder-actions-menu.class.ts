import {
  CaFolder,
  CaFolderInfo,
  CaFolderWithHierarchy,
} from '../../../model/entities/folder/ca-folder.class';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';

import { Observable } from 'rxjs';
import { CaConstellabDocument } from '../../../model/entities/folder/ca-document.class';
import { CaRouterService } from '../../../service/ca-router.service';
import { CaSecurityService } from '../../../service/ca-security.service';
import { CaFolderActionService } from '../ca-folder-action.service';
import {
  CaHierarchyObject,
  CaHierarchyObjectTagDatasource,
} from '../../../model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectBaseActionMenu } from '../../../../ca-folder/module/ca-folder-detail-page/ca-hierarchy-object-base-action-menu';

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
      action: 'delete';
      folder: CaFolderInfo;
    }
  | {
      action: 'createConstellabDocument';
      document: CaConstellabDocument;
    }
  | {
      action: 'moveFolder';
      folder: CaHierarchyObject;
    };

export class CaFolderActionsMenu extends CaHierarchyObjectBaseActionMenu<CaFolderActionEvent> {
  constructor(
    dialogService: FlDialogService,
    protected folderActionService: CaFolderActionService,
    menuDynamicService: FlMenuDynamicService,
    protected securityService: CaSecurityService,
    protected folderInfo: CaFolderInfo,
    tags?: CaHierarchyObjectTagDatasource
  ) {
    super(dialogService, menuDynamicService, folderInfo.id, tags);
  }

  /**
   * Open the action menu for the folder in the table
   */
  public openTableItemActionMenu(event: MouseEvent): Observable<CaFolderActionEvent> {
    const menu: FlMenuDynamic[] = [this.getOpenFolderButton(), this.getManageTagsButton()];

    if (this.canEditFolder()) {
      menu.push(this.getUpdateFolderButton(), this.getMoveToFolderButton(), this.getDeleteFolderButton());
    }

    return this.generateMenu(menu, event);
  }

  /**
   * Open the action menu when right-click on the folder children section
   */
  public openFolderChildrenActionMenu(event: MouseEvent): Observable<CaFolderActionEvent> {
    const menu: FlMenuDynamic[] = [
      this.getCreateChildButton(),
      {
        type: 'button',
        text: { text: 'create_constellab_document', translateText: true },
        icon: 'constellab_document',
        onClick: () => this.createConstellabDocument(),
      },
    ];

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

  protected getMoveToFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'move_to_folder', translateText: true },
      icon: 'drive_file_move',
      onClick: () => this.moveDocument(),
    };
  }

  protected getDeleteFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'delete_folder', translateText: true },
      icon: 'delete',
      onClick: () => this.openDeleteFolderDialog(),
      color: 'warn',
    };
  }

  protected canEditFolder(): boolean {
    return this.securityService.canEditFolder(this.folderInfo.leader.id);
  }

  private openUpdateFolderDialog(): void {
    this.folderActionService
      .openUpdateFolderDialog(this.folderInfo.id)
      .subscribe((folder) => this.updateDialogClosed(folder));
  }

  private updateDialogClosed(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'update',
        folder: folder,
      });
    }
    this.subject.complete();
  }

  private openChildCreation(): void {
    this.folderActionService
      .openChildCreation(this.folderInfo.id)
      .subscribe((folder) => this.createChildSuccess(folder));
  }

  private createChildSuccess(folder?: CaFolderWithHierarchy): void {
    if (folder) {
      this.subject.next({
        action: 'createChild',
        folder: folder,
      });
    }
    this.subject.complete();
  }

  private openDeleteFolderDialog(): void {
    this.folderActionService
      .openDeleteFolderDialog(this.folderInfo.id)
      .subscribe((result) => this.onDeleteClosed(result));
  }

  private onDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.subject.next({
        action: 'delete',
        folder: this.folderInfo,
      });
    }
    this.subject.complete();
  }

  private createConstellabDocument(): void {
    this.folderActionService
      .createConstellabDocument(this.folderInfo.id)
      .subscribe((doc: CaConstellabDocument) => this.createConstellabDocClosed(doc));
  }

  private createConstellabDocClosed(doc?: CaConstellabDocument): void {
    if (doc) {
      this.subject.next({
        action: 'createConstellabDocument',
        document: doc,
      });
    }
    this.subject.complete();
  }

  private moveDocument(): void {
    this.folderActionService
      .moveFolder(this.folderInfo.id)
      .subscribe((folder) => this.onMoveFolderClosed(folder));
  }

  private onMoveFolderClosed(folder?: CaHierarchyObject): void {
    if (folder) {
      this.subject.next({
        action: 'moveFolder',
        folder: folder,
      });
    }
    this.subject.complete();
  }
}
