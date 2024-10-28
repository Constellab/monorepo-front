import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaConstellabDocument, CaDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import {
  FlDialogService,
  FlMenuDynamicService,
  FlPortalActionsService, FlPortalService,
  FlServerError,
  FlSnackBarService
} from '@monorepo/front-core-lib';
import { CaDocumentTextEditorConfig } from '../../../ca-document-core/ca-document-text-editor.config';
import { FormControl } from '@angular/forms';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { ClHelpService } from '@monorepo/core-lib';
import {
  CaDocumentActionDetailMenu,
  CaDocumentActionEvent,
  CaDocumentActionMenu
} from '../../../ca-document-core/ca-document-action-menu';
import { Observable, tap } from 'rxjs';
import { CaConstellabDocumentService } from '../../../../../ca-core/service-api/ca-constellab-document.service';

/**
 * Page to show a constellab document with the possibility to edit it.
 */
@Component({
  selector: 'ca-document-detail-page',
  templateUrl: './ca-document-detail-page.component.html',
  styleUrls: ['./ca-document-detail-page.component.scss']
})
export class CaDocumentDetailPageComponent implements OnInit {

  document: CaDocument;

  getIsLoading: boolean = true;

  textEditorConfig: CaDocumentTextEditorConfig;
  contentFormControl: FormControl<TeRichTextContent> = new FormControl({ disabled: true, value: null });
  saveDescriptionFunc: (value: TeRichTextContent) => Observable<CaConstellabDocument>;

  constructor(private route: ActivatedRoute,
              private folderService: CaFolderService,
              private state: CaHierarchyObjectDetailState,
              private dialogService: FlDialogService,
              private menuDynamicService: FlMenuDynamicService,
              private actionService: FlPortalActionsService,
              private snackBarService: FlSnackBarService,
              private portalService: FlPortalService,
              private constellabDocumentService: CaConstellabDocumentService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.id)
    );

  }

  private init(id: string): void {
    this.folderService.getConstellabDocument(id).subscribe({
      next: doc => this.getDocumentSuccess(doc),
      error: () => this.getIsLoading = false
    });
  }

  private getDocumentSuccess(constellabDocument: CaConstellabDocument): void {
    this.document = constellabDocument.document;
    this.contentFormControl.patchValue(constellabDocument.content, { emitEvent: false });
    this.textEditorConfig = new CaDocumentTextEditorConfig(constellabDocument.document.id,
      this.folderService);
    this.getIsLoading = false;

    this.saveDescriptionFunc = (value: TeRichTextContent) =>
      this.folderService.updateConstellabDocument(this.document.id, value).pipe(
        tap({
          next: doc => this.saveContentSuccess(doc),
          error: error => this.onError(error)
        }));
  }

  private saveContentSuccess(document: CaConstellabDocument): void {
    this.document = document.document;
  }

  private onError(error: FlServerError): void {
    // don't show unknown server error
    if (error?.nestedError?.code !== 'error.server_error') {
      this.snackBarService.openErrorMessage({ text: error.message, translateText: false });
    }
  }

  openDocumentActionMenu(document: CaDocument, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const documentActionMenu = new CaDocumentActionDetailMenu(this.dialogService, this.folderService,
      this.menuDynamicService, this.actionService, document.basicInfo,  this.constellabDocumentService, this.portalService, this.textEditorConfig);

    documentActionMenu.openActionMenu(false, event).subscribe(event => {
      this.onDocumentAction(event);
    });
  }

  private onDocumentAction(event: CaDocumentActionEvent): void {
    if (event.action === 'delete') {
      this.state.navigateToParentFolder();
    } else {
      this.document = event.document;
    }
  }

  toggleEditMode(): void {
    if (this.contentFormControl.disabled) {
      // use emitFalse to avoid the value change event
      this.contentFormControl.enable({ emitEvent: false });
      this.folderService.checkEditConstellabDocument(this.document.id).subscribe({
        error: () => this.contentFormControl.disable({ emitEvent: false })
      });
    } else {
      this.contentFormControl.disable({ emitEvent: false });
    }
  }

  print(): void {
    if (window) {
      window.print();
    }
  }

  renameDocument(newTitle: string): void {
    this.folderService.renameDocument(this.document.id, newTitle).subscribe();
  }
}
