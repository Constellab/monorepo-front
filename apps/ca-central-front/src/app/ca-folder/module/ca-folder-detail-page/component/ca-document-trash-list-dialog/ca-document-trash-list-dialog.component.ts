import { Component, inject } from '@angular/core';
import {
  CaDocument,
  CaDocumentDatasource,
} from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { CaDocumentActionEvent } from '../../../ca-document-core/ca-document-action-menu';

export interface CaDocumentTrashListDialogInput {
  folderId: string;
}

/**
 * dialog to show the list of documents in the trash
 */
@Component({
  selector: 'ca-document-trash-list-dialog',
  templateUrl: './ca-document-trash-list-dialog.component.html',
  styleUrls: ['./ca-document-trash-list-dialog.component.scss'],
  standalone: false,
})
export class CaDocumentTrashListDialogComponent {
  private folderService = inject(CaFolderService);
  private input = inject<CaDocumentTrashListDialogInput>(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<CaDocumentTrashListDialogComponent>>(MatDialogRef);
  private dialogService = inject(FlDialogService);

  documentDatasource: CaDocumentDatasource;

  restoredDocuments: CaDocument[] = [];

  constructor() {
    const folderService = this.folderService;
    const input = this.input;

    this.documentDatasource = folderService.getTrashedDocuments(input.folderId);

    this.dialogRef.backdropClick().subscribe(() => this.dialogRef.close(this.restoredDocuments));
  }

  onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'restoreFromTrash') {
      this.restoredDocuments.push(event.document);
    }
  }

  emptyTrash(): void {
    const input: FlConfirmDialogInput = {
      title: 'empty_trash',
      content: 'empty_trash_confirmation',
      observable: this.folderService.emptyTrash(this.input.folderId),
      successMessage: 'trash_emptied',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onEmptyClosed(result));
  }

  private onEmptyClosed(result: FlConfirmDialogResult<void>): void {
    if (result.choice) {
      this.documentDatasource.getFirstPage();
    }
  }
}
