import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlMenuDynamic,
  FlMenuDynamicService,
  FlOverlayRef,
  FlPortalActionResult,
  FlPortalActionsService,
  FlPortalService,
} from '@monorepo/front-core-lib';
import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput,
} from './component/ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import {
  CaDocument,
  CaDocumentBasicInfo,
} from '../../../ca-core/model/entities/folder/ca-document.class';
import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput,
} from '../../../ca-core/entity-module/ca-folder-core/component/ca-select-folder-dialog/ca-select-folder-dialog.component';
import { CaFolder } from '../../../ca-core/model/entities/folder/ca-folder.class';
import { CaFolderService } from '../../../ca-core/service-api/ca-folder.service';
import { mergeMap, Observable, Subject } from 'rxjs';
import { CaRouterService } from '../../../ca-core/service/ca-router.service';
import {
  TeCompleteConfig,
  TeTextEditorHistoryPortalComponent,
  TeTextEditorHistoryPortalData,
} from '@monorepo/text-editor';
import { CaConstellabDocumentHistoryService } from '../../../ca-core/service/ca-constellab-document-history.service';

export type CaDocumentActionEvent =
  | {
      action: 'update' | 'moveToTrash' | 'restoreFromTrash' | 'moveToFolder';
      document: CaDocument;
    }
  | {
      action: 'delete';
      document: CaDocumentBasicInfo;
    };

export class CaDocumentActionMenu {
  private subject: Subject<CaDocumentActionEvent> = new Subject();

  constructor(
    private dialogService: FlDialogService,
    private folderService: CaFolderService,
    private menuDynamicService: FlMenuDynamicService,
    private actionService: FlPortalActionsService,
    protected documentInfo: CaDocumentBasicInfo
  ) {
  }

  public openActionMenu(
    showLinks: boolean,
    event: MouseEvent
  ): Observable<CaDocumentActionEvent | null> {
    const menu = this.generateActionMenu(showLinks);

    const overlayRef = this.menuDynamicService.openDynamicMenuFromMouseEvent(
      menu,
      event
    );

    return overlayRef.detachments().pipe(
      mergeMap((menu: FlMenuDynamic) => {
        // when the menu was closed without clicking a button
        // we have to complete the subject
        // if the menu was a button, the subject will be completed in the button action
        if (!menu || menu.type !== 'button') {
          this.subject.complete();
        }
        return this.subject.asObservable();
      })
    );
  }

  protected generateActionMenu(showLinks: boolean): FlMenuDynamic[] {
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
          href: this.folderService.getDocumentDownloadUrl(
            this.documentInfo.id,
            this.documentInfo.name
          ),
        });
      }
    }

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

  renameDocument(): void {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'update',
      object: { name: this.documentInfo.name },
      documentId: this.documentInfo.id,
    };

    this.dialogService
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

  moveToTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'move_document_to_trash',
      content: 'move_document_to_trash_confirmation',
      observable: this.folderService.moveDocumentToTrash(this.documentInfo.id),
      successMessage: 'document_moved_to_trash',
    };

    this.dialogService
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

  restoreFromTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'restore_document_from_trash',
      content: 'restore_document_from_trash_confirmation',
      observable: this.folderService.restoreDocumentFromTrash(
        this.documentInfo.id
      ),
      successMessage: 'document_restored_from_trash',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onRestoreFromTrashClosed(result));
  }

  private onRestoreFromTrashClosed(
    result: FlConfirmDialogResult<CaDocument>
  ): void {
    if (result.choice) {
      this.subject.next({
        action: 'restoreFromTrash',
        document: result.result,
      });
    }
    this.subject.complete();
  }

  deleteDocument(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_document',
      content: 'delete_document_confirmation',
      observable: this.folderService.deleteDocument(this.documentInfo.id),
      successMessage: 'document_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDeleteClosed(result, this.documentInfo));
  }

  private onDeleteClosed(
    result: FlConfirmDialogResult,
    document: CaDocumentBasicInfo
  ): void {
    if (result.choice) {
      this.subject.next({
        action: 'delete',
        document: document,
      });
    }
    this.subject.complete();
  }

  moveDocument(): void {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'move_to_folder', translateText: true },
      mode: 'any',
      currentObjectId: this.documentInfo.id,
    };
    this.dialogService
      .openMediumDialog(CaSelectFolderDialogComponent, {
        data: input,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((folder) => this.onMoveDocumentClosed(folder));
  }

  private onMoveDocumentClosed(folder?: CaFolder): void {
    if (folder) {
      this.actionService
        .addAction({
          type: 'move-doc-to-folder',
          action: this.folderService.moveDocumentToFolder(
            this.documentInfo.id,
            folder.id
          ),
          text: { text: 'moving_to_folder', translateText: true },
        })
        .subscribe({
          next: (result) => this.onMoveDocumentSuccess(result),
          error: () => this.subject.complete(),
        });
    } else {
      this.subject.complete();
    }
  }

  private onMoveDocumentSuccess(
    result: FlPortalActionResult<CaDocument>
  ): void {
    if (result.status === 'success') {
      this.subject.next({
        action: 'moveToFolder',
        document: result.result,
      });
    }
    this.subject.complete();
  }
}

export class CaDocumentActionDetailMenu extends CaDocumentActionMenu {

  private historyOverlayRef: FlOverlayRef;

  constructor(dialogService: FlDialogService,
              folderService: CaFolderService,
              menuDynamicService: FlMenuDynamicService,
              actionService: FlPortalActionsService,
              documentInfo: CaDocumentBasicInfo,
              private constellabDocumentService: CaConstellabDocumentHistoryService,
              private portalService: FlPortalService,
              private textEditorConfig: TeCompleteConfig
  ) {
    super(dialogService, folderService, menuDynamicService, actionService, documentInfo);
  }

  protected override generateActionMenu(showLinks: boolean){
    const menu = super.generateActionMenu(showLinks);
    if (!showLinks && this.documentInfo.isConstellabDocument) {
      menu.unshift({
        type: 'button',
        text: { text: 'history', translateText: true },
        icon: 'history',
        onClick: () => this.toggleConstellabDocumentHistoryPanel(),
      });
    }
    return menu;
  }

  private toggleConstellabDocumentHistoryPanel(): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      this.historyOverlayRef = this.portalService?.createPortal(
        TeTextEditorHistoryPortalComponent,
        this.portalService?.getRightSidePortalConfig(true),
        {
          service: this.constellabDocumentService,
          entityId: this.documentInfo.id,
          textEditorConfig: this.textEditorConfig,
          isEditable: true
        } as TeTextEditorHistoryPortalData
      );
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }
}
