import { Component, OnInit } from '@angular/core';
import { LabNoteContent } from '../../../lab-core/model/entities/lab-note.entity';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib';
import { ActivatedRoute } from '@angular/router';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabDocumentTemplateService } from '../../../lab-core/entity-service/lab-document-template.service';
import { LabDocumentTemplate } from '../../../lab-core/model/entities/lab-document-template.entity';
import { LabDocumentTemplateTextEditorConfig } from '../lab-document-template-text-editor-config.class';
import { TeConfig, TeRichTextContent } from '@monorepo/text-editor';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'lab-document-template-detail-page',
  templateUrl: './lab-document-template-detail-page.component.html',
  styleUrls: ['./lab-document-template-detail-page.component.scss']
})
export class LabDocumentTemplateDetailPageComponent implements OnInit {

  documentTemplate: LabDocumentTemplate;

  textEditorConfig: TeConfig;

  isLoading: boolean = false;

  formControl: FormControl<LabNoteContent> = new FormControl({ value: null });

  saveContentFunc: (value: TeRichTextContent) => Observable<TeRichTextContent>;
  private documentTemplateId: string;

  constructor(private route: ActivatedRoute,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private documentTemplateService: LabDocumentTemplateService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.id)
    );
  }

  private init(id: string): void {

    this.documentTemplateId = id;
    this.textEditorConfig = new LabDocumentTemplateTextEditorConfig(id);
    this.isLoading = true;
    this.documentTemplateService.getDocumentTemplate(id).subscribe({
      next: (template) => this.getDocumentTemplateSuccess(template),
      error: () => this.isLoading = false
    });

    this.documentTemplateService.getDocumentTemplateContent(id).subscribe({
      next: (content) => this.getDocumentTemplateContentSuccess(content)
    });

    this.saveContentFunc = (value: TeRichTextContent) =>
      this.documentTemplateService.updateContent(this.documentTemplateId, value);
  }

  private getDocumentTemplateSuccess(documentTemplate: LabDocumentTemplate): void {
    this.documentTemplate = documentTemplate;
    this.isLoading = false;
  }

  private getDocumentTemplateContentSuccess(content: TeRichTextContent): void {
    this.formControl.patchValue(content, { emitEvent: false });
  }

  updateTitle(title: string): void {
    this.documentTemplateService.updateTitle(this.documentTemplateId, title).subscribe(
      template => this.documentTemplate.title = template.title
    );
  }

  delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_document_template',
      content: 'biox.delete_document_template_confirmation',
      observable: this.documentTemplateService.delete(this.documentTemplateId),
      successMessage: 'biox.document_template_deleted'
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.deletedClosed(result)
    );
  }

  private deletedClosed(result: FlConfirmDialogResult<void>): void {
    if (result.choice) {
      this.routerService.navigateToDocumentSearch();
    }
  }

  printDocument(): void {
    if (window) {
      window.print();
    }
  }
}

