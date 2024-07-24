import { Component, Inject } from '@angular/core';
import { CaDocument, CaDocumentDatasource } from '../../../../../ca-core/model/entities/project/ca-document.class';
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  CaDocumentActionEvent
} from '../../../ca-document-core/component/ca-document-actions-menu/ca-document-actions-menu.component';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';

export interface CaDocumentTrashListDialogInput {
  projectId: string;
}

/**
 * dialog to show the list of documents in the trash
 */
@Component({
  selector: 'ca-document-trash-list-dialog',
  templateUrl: './ca-document-trash-list-dialog.component.html',
  styleUrls: ['./ca-document-trash-list-dialog.component.scss'],
})
export class CaDocumentTrashListDialogComponent {

  documentDatasource: CaDocumentDatasource;

  restoredDocuments: CaDocument[] = [];

  constructor(private projectService: CaProjectService,
              @Inject(MAT_DIALOG_DATA) private input: CaDocumentTrashListDialogInput,
              private dialogRef: MatDialogRef<CaDocumentTrashListDialogComponent>,
              private dialogService: FlDialogService) {
    this.documentDatasource = projectService.getTrashedDocuments(input.projectId);

    this.dialogRef.backdropClick()
      .subscribe(() => this.dialogRef.close(this.restoredDocuments));
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
      translateTitleAndContent: true,
      observable: this.projectService.emptyTrash(this.input.projectId),
      successMessage: 'trash_emptied',
      translateMessage: true
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onEmptyClosed(result)
    );
  }

  private onEmptyClosed(result: FlConfirmDialogResult<void>): void{
    if(result.choice){
      this.documentDatasource.getFirstPage();
    }
  }

}
