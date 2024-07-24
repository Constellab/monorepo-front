import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CaDocument } from '../../../../../ca-core/model/entities/project/ca-document.class';
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
import { CaProjectService } from '../../../../../ca-core/service-api/ca-project.service';
import { ClHelpService } from '@monorepo/core-lib';
import {
  CaSelectProjectDialogComponent,
  CaSelectProjectDialogInput
} from '../../../../../ca-core/entity-module/ca-project-core/component/ca-select-project-dialog/ca-select-project-dialog.component';
import { CaProject } from '../../../../../ca-core/model/entities/project/ca-project.class';

export interface CaDocumentActionEvent {
  action: 'update' | 'delete' | 'moveToTrash' | 'restoreFromTrash' | 'moveToProject';
  document: CaDocument;
}

@Component({
  selector: 'ca-document-actions-menu',
  templateUrl: './ca-document-actions-menu.component.html',
  styleUrls: ['./ca-document-actions-menu.component.scss']
})
export class CaDocumentActionsMenuComponent {

  @Input() document: CaDocument;

  @Input() showViewLinks: boolean = true;

  @Output() documentAction: EventEmitter<CaDocumentActionEvent> = new EventEmitter();

  constructor(private dialogService: FlDialogService,
              private projectService: CaProjectService,
              private actionService: FlPortalActionsService) {
  }

  cancelEvent(event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
  }

  getDocumentDownloadUrl(): string {
    return this.projectService.getDocumentDownloadUrl(this.document.projectId, this.document.name);
  }

  renameDocument(): void {
    const input: CaDocumentNameFormDialogInput = {
      mode: 'update',
      object: { name: this.document.name },
      documentId: this.document.id,
      projectId: this.document.projectId
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
      observable: this.projectService.moveDocumentToTrash(this.document.id),
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
      observable: this.projectService.restoreDocumentFromTrash(this.document.id),
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
      observable: this.projectService.deleteDocument(this.document.id),
      successMessage: 'document_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDeleteClosed(result, this.document)
    );
  }

  private onDeleteClosed(result: FlConfirmDialogResult, document: CaDocument): void {
    if (result.choice) {
      this.documentAction.emit({
        action: 'delete',
        document: document
      });
    }
  }

  moveDocument(): void {
    const input: CaSelectProjectDialogInput = {
      title: { text: 'move_to_project', translateText: true },
      mode: 'any',
      currentProjectId: this.document.projectId
    };
    this.dialogService.openMediumDialog(CaSelectProjectDialogComponent, { data: input, autoFocus: false })
      .afterClosed().subscribe((project) => this.onMoveDocumentClosed(project));
  }

  private onMoveDocumentClosed(project?: CaProject): void {
    if (project) {
      this.actionService.addAction({
        type: 'move-doc-to-project',
        action: this.projectService.moveDocumentToProject(this.document.id, project.id),
        text: { text: 'moving_to_project', translateText: true }
      }).subscribe(
        result => this.onMoveDocumentSuccess(result)
      );
    }
  }

  private onMoveDocumentSuccess(result: FlPortalActionResult<CaDocument>): void {
    if (result.status === 'success') {
      this.documentAction.emit({
        action: 'moveToProject',
        document: result.result
      });
    }
  }

}
