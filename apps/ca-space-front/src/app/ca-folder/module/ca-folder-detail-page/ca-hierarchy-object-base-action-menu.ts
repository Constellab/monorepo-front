import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlBaseActionMenu, FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { Observable } from 'rxjs';

import { CaFolderActionService } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';
import {
  CaHierarchyObjectTagsDialogComponent,
  CaHierarchyObjectTagsDialogInput,
} from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tags-dialog/ca-hierarchy-object-tags-dialog.component';
import {
  CaHierarchyObjectTokenDialogInput,
  CaHierarchyObjectTokensDialogComponent,
} from '../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-tokens-dialog/ca-hierarchy-object-tokens-dialog.component';
import { CaAvailableTagDatasource } from '../../../ca-core/model/entities/ca-tag.class';
import {
  CaHierarchyObject,
  CaHierarchyObjectTagDatasource,
} from '../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaHierarchyObjectService } from '../../../ca-core/service-api/ca-hierarchy-object.service';

export type CaHierarchyObjectMoveToTrashAction = {
  action: 'moveToTrash';
  hierarchyObject: CaHierarchyObject;
};

export type CaHierarchyObjectRestoreFromTrashAction = {
  action: 'restoreFromTrash';
  hierarchyObject: CaHierarchyObject;
};

export type CaHierarchyObjectMoveToFolderAction = {
  action: 'moveToFolder';
  hierarchyObject: CaHierarchyObject;
};

export type CaHierarchyObjectActionBase =
  | CaHierarchyObjectRestoreFromTrashAction
  | {
      action: 'delete';
      hierarchyObjectId: string;
    };

export interface CaHierarchyObjectActionTags {
  tags?: CaHierarchyObjectTagDatasource;
  availableTags?: CaAvailableTagDatasource;
}

/**
 * Base class to manage the action menu for a hierarchy object (folder, document, ...)
 * It contains common actions like manage tags
 */
export class CaHierarchyObjectBaseActionMenu extends FlBaseActionMenu {
  constructor(
    injector: Injector,
    protected hierarchyObjectId: string,
    private tags?: CaHierarchyObjectActionTags
  ) {
    super(injector);
  }

  protected getManageTagsButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'tags', translateText: true },
      icon: 'tag',
      onClick: () => this.openTagDialog(),
    };
  }

  private openTagDialog(): void {
    const data: CaHierarchyObjectTagsDialogInput = {
      hierarchyObjectId: this.hierarchyObjectId,
      tags: this.tags?.tags,
      availableTags: this.tags?.availableTags,
    };
    this.injector
      .get(FlDialogService)
      .openSmallDialog(CaHierarchyObjectTagsDialogComponent, { data: data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  protected getMoveToFolderButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'move_to_folder', translateText: true },
      icon: 'drive_file_move',
      onClick: () => this.moveToFolder(),
    };
  }

  private moveToFolder(): void {
    this.injector
      .get(CaFolderActionService)
      .moveObjectToFolder(this.hierarchyObjectId)
      .subscribe((document) => this.onMoveClosed(document));
  }

  private onMoveClosed(hierarchyObject: CaHierarchyObject | null): void {
    if (hierarchyObject) {
      this.subject.next({
        action: 'moveToFolder',
        hierarchyObject: hierarchyObject,
      } as CaHierarchyObjectMoveToFolderAction);
    }
    this.subject.complete();
  }

  ///////////////////////////// TRASH ////////////////////////////

  protected getMoveToTrashButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'move_object_to_trash', translateText: true },
      icon: 'clear',
      onClick: () => this.moveToTrash(),
      color: 'warn',
    };
  }

  private moveToTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'move_object_to_trash',
      content: 'move_object_to_trash_confirmation',
      observable: this.injector.get(CaHierarchyObjectService).moveToTrash(this.hierarchyObjectId),
      successMessage: 'object_moved_to_trash',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onMoveToTrashClosed(result));
  }

  private onMoveToTrashClosed(result: FlConfirmDialogResult<CaHierarchyObject>): void {
    if (result.choice) {
      this.subject.next({
        action: 'moveToTrash',
        hierarchyObject: result.result,
      } as CaHierarchyObjectMoveToTrashAction);
    }
    this.subject.complete();
  }

  public openTrashMenu(event: MouseEvent): Observable<CaHierarchyObjectActionBase | null> {
    const menu: FlMenuDynamic[] = this.getHierarchyObjectTrashMenu();
    return this.generateMenu(menu, event);
  }

  private getHierarchyObjectTrashMenu(): FlMenuDynamic[] {
    return [
      this.getRestoreFromTrashButton(),
      {
        type: 'button',
        text: { text: 'delete_object', translateText: true },
        icon: 'delete_forever',
        onClick: () => this.deleteHierarchyObject(),
        color: 'warn',
      },
    ];
  }

  private getRestoreFromTrashButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'restore_object_from_trash', translateText: true },
      icon: 'restore_from_trash',
      onClick: () => this.restoreHierarchyObjectMenu(),
    };
  }

  private restoreHierarchyObjectMenu(): void {
    const input: FlConfirmDialogInput = {
      title: 'restore_object_from_trash',
      content: 'restore_object_from_trash_confirmation',
      observable: this.injector.get(CaHierarchyObjectService).restoreFromTrash(this.hierarchyObjectId),
      successMessage: 'object_restored_from_trash',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onRestoreHierarchyObjectFromTrashClosed(result));
  }

  private onRestoreHierarchyObjectFromTrashClosed(result: FlConfirmDialogResult<CaHierarchyObject>): void {
    if (result.choice) {
      this.subject.next({
        action: 'restoreFromTrash',
        hierarchyObject: result.result,
      } as CaHierarchyObjectActionBase);
    }
    this.subject.complete();
  }

  private deleteHierarchyObject(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_object',
      content: 'delete_object_confirmation',
      observable: this.injector.get(CaHierarchyObjectService).deleteHierarchyObject(this.hierarchyObjectId),
      successMessage: 'object_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onHierarchyObjectDeleteClosed(result));
  }

  private onHierarchyObjectDeleteClosed(result: FlConfirmDialogResult): void {
    if (result.choice) {
      this.subject.next({
        action: 'delete',
        hierarchyObjectId: this.hierarchyObjectId,
      } as CaHierarchyObjectActionBase);
    }
    this.subject.complete();
  }

  /**
   * Simple menu with only move to trash,  restore from trash and delete button
   * @param event
   * @param hierarchyObject
   */
  public openTrashRestoreMenu(
    event: MouseEvent,
    hierarchyObject: CaHierarchyObject
  ): Observable<CaHierarchyObjectMoveToTrashAction | CaHierarchyObjectActionBase | null> {
    const menu: FlMenuDynamic[] = [];
    if (hierarchyObject.isInTrash()) {
      menu.push(...this.getHierarchyObjectTrashMenu());
    } else {
      menu.push(this.getMoveToTrashButton());
    }
    return this.generateMenu(menu, event);
  }

  ///////////////////////////////////// TOKENS ///////////////////////////////////////

  protected getOpenTokensButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: { text: 'hierarchy_object_tokens', translateText: true },
      icon: 'share',
      onClick: () => this.openTokensDialog(),
    };
  }

  private openTokensDialog(): void {
    const data: CaHierarchyObjectTokenDialogInput = {
      hierarchyObjectId: this.hierarchyObjectId,
    };
    this.injector
      .get(FlDialogService)
      .openMediumDialog(CaHierarchyObjectTokensDialogComponent, { data: data })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }
}
