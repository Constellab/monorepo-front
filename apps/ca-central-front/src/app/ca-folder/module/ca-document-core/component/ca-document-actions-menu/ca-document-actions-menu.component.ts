import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaDocument, CaDocumentBasicInfo } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import {
  CaDocumentNameFormDialogComponent,
  CaDocumentNameFormDialogInput
} from '../ca-document-name-form-dialog/ca-document-name-form-dialog.component';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService
} from '@monorepo/front-core-lib';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { ClHelpService } from '@monorepo/core-lib';
import { CaFolder } from '../../../../../ca-core/model/entities/folder/ca-folder.class';
import {
  CaSelectFolderDialogComponent,
  CaSelectFolderDialogInput
} from '../../../../../ca-core/entity-module/ca-folder-core/component/ca-select-folder-dialog/ca-select-folder-dialog.component';

export type CaDocumentActionEvent = {
  action: 'update' | 'moveToTrash' | 'restoreFromTrash' | 'moveToFolder';
  document: CaDocument;
} | {
  action: 'delete';
  document: CaDocumentBasicInfo;
}

@Component({
  selector: 'ca-document-actions-menu',
  templateUrl: './ca-document-actions-menu.component.html',
  styleUrls: ['./ca-document-actions-menu.component.scss']
})
export class CaDocumentActionsMenuComponent {

  @Input({ required: true }) documentInfo: CaDocumentBasicInfo;

  @Input() showViewLinks: boolean = true;

  @Output() documentAction: EventEmitter<CaDocumentActionEvent> = new EventEmitter();

  constructor(private dialogService: FlDialogService,
              private folderService: CaFolderService,
              private actionService: FlPortalActionsService) {
  }

  cancelEvent(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  getDocumentDownloadUrl(): string {
    return this.folderService.getDocumentDownloadUrl(this.documentInfo.id, this.documentInfo.name);
  }

  renameDocument(): void {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'update',
      object: { name: this.documentInfo.name },
      documentId: this.documentInfo.id
    };

    this.dialogService.openSmallDialog(CaDocumentNameFormDialogComponent, { data: input }).afterClosed().subscribe(
      result => this.onRenameClosed(result)
    );
  }

  private onRenameClosed(doc?: CaDocument): void {
    if (doc) {
      this.documentAction.emit({
        action: 'update',
        document: doc
      });
    }
  }

  moveToTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'move_document_to_trash',
      content: 'move_document_to_trash_confirmation',
      translateTitleAndContent: true,
      observable: this.folderService.moveDocumentToTrash(this.documentInfo.id),
      successMessage: 'document_moved_to_trash',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onMoveToTrashClosed(result)
    );
  }

  private onMoveToTrashClosed(result: FlConfirmDialogResult<CaDocument>): void {
    if (result.choice) {
      this.documentAction.emit({
        action: 'moveToTrash',
        document: result.result
      });
    }
  }

  restoreFromTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'restore_document_from_trash',
      content: 'restore_document_from_trash_confirmation',
      translateTitleAndContent: true,
      observable: this.folderService.restoreDocumentFromTrash(this.documentInfo.id),
      successMessage: 'document_restored_from_trash',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onRestoreFromTrashClosed(result)
    );
  }

  private onRestoreFromTrashClosed(result: FlConfirmDialogResult<CaDocument>): void {
    if (result.choice) {
      this.documentAction.emit({
        action: 'restoreFromTrash',
        document: result.result
      });
    }
  }

  deleteDocument(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_document',
      content: 'delete_document_confirmation',
      translateTitleAndContent: true,
      observable: this.folderService.deleteDocument(this.documentInfo.id),
      successMessage: 'document_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, this.documentInfo)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, document: CaDocumentBasicInfo): void {
    if (result.choice) {
      this.documentAction.emit({
        action: 'delete',
        document: document
      });
    }
  }

  moveDocument(): void {
    const input: CaSelectFolderDialogInput = {
      title: { text: 'move_to_folder', translateText: true },
      mode: 'any',
      currentObjectId: this.documentInfo.id
    };
    this.dialogService.openMediumDialog(CaSelectFolderDialogComponent, { data: input, autoFocus: false })
      .afterClosed().subscribe((folder) => this.onMoveDocumentClosed(folder));
  }

  private onMoveDocumentClosed(folder?: CaFolder): void {
    if (folder) {
      this.actionService.addAction({
        type: 'move-doc-to-folder',
        action: this.folderService.moveDocumentToFolder(this.documentInfo.id, folder.id),
        text: { text: 'moving_to_folder', translateText: true }
      }).subscribe(
        result => this.onMoveDocumentSuccess(result)
      );
    }
  }

  private onMoveDocumentSuccess(result: FlPortalActionResult<CaDocument>): void {
    if (result.status === 'success') {
      this.documentAction.emit({
        action: 'moveToFolder',
        document: result.result
      });
    }
  }

}
