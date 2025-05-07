import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlOverlayRef, FlPortalService } from '@monorepo/front-core-lib/fl-portal';

import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput,
} from './component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import { CaDocument, CaDocumentBasicInfo } from '../../../ca-core/model/entities/folder/ca-document.class';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { Observable } from 'rxjs';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  TeCompleteConfig,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
} from '@monorepo/text-editor';
import { CaConstellabDocumentHistoryService } from '../../../ca-core/service/ca-constellab-document-history.service';
import {
  CaHierarchyObjectActionTags,
  CaHierarchyObjectBaseActionMenu,
} from '../ca-folder-detail-page/ca-hierarchy-object-base-action-menu';
import { Injector } from '@angular/core';
import { CaFolderActionService } from '../../../ca-core/entity-module/ca-folder-core/ca-folder-action.service';

export type CaDocumentActionEvent =
  | {
      action: 'update' | 'moveToTrash' | 'restoreFromTrash' | 'moveToFolder';
      document: CaDocument;
    }
  | {
      action: 'delete';
      document: CaDocumentBasicInfo;
    };

export class CaDocumentActionMenu extends CaHierarchyObjectBaseActionMenu<CaDocumentActionEvent> {
  constructor(
    injector: Injector,
    protected documentInfo: CaDocumentBasicInfo,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, documentInfo.id, tags);
  }

  public openDefaultActionMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const menu = this.getDefaultMenuItems(true);

    return this.generateMenu(menu, event);
  }

  protected getDefaultMenuItems(showLinks: boolean): FlMenuDynamic[] {
    if (this.documentInfo.inTrash) {
      return this.getTrashMenu();
    }

    const menu: FlMenuDynamic[] = [];

    if (showLinks) {
      if (this.documentInfo.isConstellabDocument) {
        menu.push({
          type: 'link',
          text: { text: 'view_document', translateText: true },
          icon: 'visibility',
          link: CaRouterService.getDocumentDetailRoute(this.documentInfo.id),
        });
      } else {
        menu.push({
          type: 'downloadLink',
          text: { text: 'download_document', translateText: true },
          icon: 'cloud_download',
          href: this.injector
            .get(CaFolderService)
            .getDocumentDownloadUrl(this.documentInfo.id, this.documentInfo.name),
        });
      }
    }

    menu.push(this.getManageTagsButton());

    menu.push({
      type: 'button',
      text: { text: 'rename_document', translateText: true },
      icon: 'edit',
      onClick: () => this.renameDocument(),
    });
    menu.push({
      type: 'button',
      text: { text: 'move_to_folder', translateText: true },
      icon: 'drive_file_move',
      onClick: () => this.moveDocument(),
    });
    menu.push({
      type: 'button',
      text: { text: 'move_document_to_trash', translateText: true },
      icon: 'clear',
      onClick: () => this.moveToTrash(),
      color: 'warn',
    });

    return menu;
  }

  private getTrashMenu(): FlMenuDynamic[] {
    return [
      {
        type: 'button',
        text: { text: 'restore_document_from_trash', translateText: true },
        icon: 'restore_from_trash',
        onClick: () => this.restoreFromTrash(),
      },
      {
        type: 'button',
        text: { text: 'delete_document', translateText: true },
        icon: 'delete_forever',
        onClick: () => this.deleteDocument(),
        color: 'warn',
      },
    ];
  }

  private renameDocument(): void {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'update',
      object: { name: this.documentInfo.name },
      documentId: this.documentInfo.id,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(CaDocumentNameFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onRenameClosed(result));
  }

  private onRenameClosed(doc?: CaDocument): void {
    if (doc) {
      this.subject.next({
        action: 'update',
        document: doc,
      });
    }
    this.subject.complete();
  }

  private moveToTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'move_document_to_trash',
      content: 'move_document_to_trash_confirmation',
      observable: this.injector.get(CaFolderService).moveDocumentToTrash(this.documentInfo.id),
      successMessage: 'document_moved_to_trash',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onMoveToTrashClosed(result));
  }

  private onMoveToTrashClosed(result: FlConfirmDialogResult<CaDocument>): void {
    if (result.choice) {
      this.subject.next({
        action: 'moveToTrash',
        document: result.result,
      });
    }
    this.subject.complete();
  }

  private restoreFromTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'restore_document_from_trash',
      content: 'restore_document_from_trash_confirmation',
      observable: this.injector.get(CaFolderService).restoreDocumentFromTrash(this.documentInfo.id),
      successMessage: 'document_restored_from_trash',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onRestoreFromTrashClosed(result));
  }

  private onRestoreFromTrashClosed(result: FlConfirmDialogResult<CaDocument>): void {
    if (result.choice) {
      this.subject.next({
        action: 'restoreFromTrash',
        document: result.result,
      });
    }
    this.subject.complete();
  }

  private deleteDocument(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_document',
      content: 'delete_document_confirmation',
      observable: this.injector.get(CaFolderService).deleteDocument(this.documentInfo.id),
      successMessage: 'document_deleted',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, this.documentInfo));
  }

  private onDeleteClosed(result: FlConfirmDialogResult, document: CaDocumentBasicInfo): void {
    if (result.choice) {
      this.subject.next({
        action: 'delete',
        document: document,
      });
    }
    this.subject.complete();
  }

  private moveDocument(): void {
    this.injector
      .get(CaFolderActionService)
      .moveObjectToFolder(this.documentInfo.id, (folderHierarchyId: string, folderId: string) =>
        this.injector.get(CaFolderService).moveDocumentToFolder(folderHierarchyId, folderId)
      )
      .subscribe((document) => this.onMoveDocumentClosed(document));
  }

  private onMoveDocumentClosed(document: CaDocument): void {
    if (document) {
      this.subject.next({
        action: 'moveToFolder',
        document: document,
      });
    }
    this.subject.complete();
  }
}

export class CaDocumentActionDetailMenu extends CaDocumentActionMenu {
  private historyOverlayRef: FlOverlayRef;

  constructor(
    injector: Injector,
    documentInfo: CaDocumentBasicInfo,
    private textEditorConfig: TeCompleteConfig,
    tags?: CaHierarchyObjectActionTags
  ) {
    super(injector, documentInfo, tags);
  }

  public openDetailActionsMenu(event: MouseEvent): Observable<CaDocumentActionEvent | null> {
    const menu = this.getDefaultMenuItems(false);
    if (this.documentInfo.isConstellabDocument) {
      menu.unshift({
        type: 'button',
        text: { text: 'history', translateText: true },
        icon: 'history',
        onClick: () => this.toggleConstellabDocumentHistoryPanel(),
      });
    }

    return this.generateMenu(menu, event);
  }

  private toggleConstellabDocumentHistoryPanel(): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      const portalService = this.injector.get(FlPortalService);
      this.historyOverlayRef = portalService.createPortal(
        TeTextEditorHistoryPortalComponent,
        portalService.getRightSidePortalConfig(true),
        {
          service: this.injector.get(CaConstellabDocumentHistoryService),
          entityId: this.documentInfo.id,
          textEditorConfig: this.textEditorConfig,
          isEditable: true,
        } as TeTextEditorHistoryPortalData
      );
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }
}
