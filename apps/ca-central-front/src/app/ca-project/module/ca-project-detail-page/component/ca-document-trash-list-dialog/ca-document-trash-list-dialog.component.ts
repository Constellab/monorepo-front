import {Component, Inject} from '@angular/core';
import {CaDocument, CaDocumentDatasource} from '../../../../../ca-core/model/entities/project/ca-document.class';
import {CaProjectService} from '../../../../../ca-core/service-api/ca-project.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {
  CaDocumentActionEvent
} from '../../../ca-document-core/component/ca-document-actions-menu/ca-document-actions-menu.component';

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

  constructor(documentService: CaProjectService,
              @Inject(MAT_DIALOG_DATA) input: CaDocumentTrashListDialogInput,
              private dialogRef: MatDialogRef<CaDocumentTrashListDialogComponent>) {
    this.documentDatasource = documentService.getTrashedDocuments(input.projectId);

    this.dialogRef.backdropClick()
      .subscribe(() => this.dialogRef.close(this.restoredDocuments));
  }

  onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'restoreFromTrash') {
      this.restoredDocuments.push(event.document);
    }
  }

}
