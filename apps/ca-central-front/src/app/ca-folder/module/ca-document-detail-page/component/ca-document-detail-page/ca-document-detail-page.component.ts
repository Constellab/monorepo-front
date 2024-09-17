import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CaFolderService } from '../../../../../ca-core/service-api/ca-folder.service';
import { CaConstellabDocument, CaDocument } from '../../../../../ca-core/model/entities/folder/ca-document.class';
import { FlDebouncer, FlDialogService, FlMenuDynamicService, FlPortalActionsService } from '@monorepo/front-core-lib';
import { CaDocumentTextEditorConfig } from '../../../ca-document-core/ca-document-text-editor.config';
import { FormControl } from '@angular/forms';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { ClHelpService } from '@monorepo/core-lib';
import { CaDocumentActionEvent, CaDocumentActionMenu } from '../../../ca-document-core/ca-document-action-menu';

/**
 * Page to show a constellab document with the possibility to edit it.
 */
@Component({
  selector: 'ca-document-detail-page',
  templateUrl: './ca-document-detail-page.component.html',
  styleUrls: ['./ca-document-detail-page.component.scss']
})
export class CaDocumentDetailPageComponent implements OnInit, OnDestroy {

  document: CaDocument;
  contentFormControl: FormControl<TeRichTextContent> = new FormControl({disabled: true, value: null});

  textEditorConfig: CaDocumentTextEditorConfig;

  isLoading: boolean = true;

  private contentDebouncer: FlDebouncer<TeRichTextContent>;


  constructor(private route: ActivatedRoute,
              private folderService: CaFolderService,
              private state: CaHierarchyObjectDetailState,
              private dialogService: FlDialogService,
              private menuDynamicService: FlMenuDynamicService,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.id)
    );

    //create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(2500);
    this.contentDebouncer.getDebouncedValue().subscribe(
      value => this.saveContent(value)
    );
  }

  private init(id: string): void {
    this.folderService.getConstellabDocument(id).subscribe({
      next: doc => this.getDocumentSuccess(doc),
      error: () => this.isLoading = false
    });
  }

  private getDocumentSuccess(constellabDocument: CaConstellabDocument): void {
    this.document = constellabDocument.document;
    this.contentFormControl.patchValue(constellabDocument.content);
    this.textEditorConfig = new CaDocumentTextEditorConfig(constellabDocument.document.id,
      this.folderService);
    this.isLoading = false;
  }

  onContentUpdate(content: TeRichTextContent): void {
    this.contentDebouncer.setValue(content);
  }

  private saveContent(content: TeRichTextContent): void {
    this.folderService.updateConstellabDocument(this.document.id, content).subscribe(
      doc => this.document = doc.document
    );
  }

  openDocumentActionMenu(document: CaDocument, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    const documentActionMenu = new CaDocumentActionMenu(this.dialogService, this.folderService,
      this.menuDynamicService, this.actionService, document.basicInfo);

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
      this.contentFormControl.enable();
    } else {
      this.contentFormControl.disable();
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


  ngOnDestroy(): void {
    this.contentDebouncer?.markForComplete();
  }
}
