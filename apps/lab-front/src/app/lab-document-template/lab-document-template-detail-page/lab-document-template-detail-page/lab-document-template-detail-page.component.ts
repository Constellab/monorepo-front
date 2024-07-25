import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabReportContent } from '../../../lab-core/model/entities/lab-report.entity';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDebouncer, FlDialogService } from '@monorepo/front-core-lib';
import { ActivatedRoute } from '@angular/router';
import { LabRouterService } from '../../../lab-core/service/lab-router.service';
import { LabDocumentTemplateService } from '../../../lab-core/entity-service/lab-document-template.service';
import { LabDocumentTemplate } from '../../../lab-core/model/entities/lab-document-template.entity';
import { LabDocumentTemplateTextEditorConfig } from '../lab-document-template-text-editor-config.class';
import { TeConfig, TeRichTextContent } from '@monorepo/text-editor';

@Component({
  selector: 'lab-document-template-detail-page',
  templateUrl: './lab-document-template-detail-page.component.html',
  styleUrls: ['./lab-document-template-detail-page.component.scss']
})
export class LabDocumentTemplateDetailPageComponent implements OnInit, OnDestroy {

  documentTemplate: LabDocumentTemplate;
  content: TeRichTextContent;

  textEditorConfig: TeConfig;

  isLoading: boolean = false;

  private documentTemplateId: string;


  private contentDebouncer: FlDebouncer<TeRichTextContent>;

  constructor(private route: ActivatedRoute,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private documentTemplateService: LabDocumentTemplateService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.init(params.id)
    );

    // create a debouncer to save the description after x second of idle
    this.contentDebouncer = new FlDebouncer(FlDebouncer.AUTO_SAVE_DEBOUNCE_TIME);
    this.contentDebouncer.getDebouncedValue().subscribe(
      value => this.saveContent(value)
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
  }

  private getDocumentTemplateSuccess(documentTemplate: LabDocumentTemplate): void {
    this.documentTemplate = documentTemplate;
    this.isLoading = false;
  }

  private getDocumentTemplateContentSuccess(content: TeRichTextContent): void {
    this.content = content;
  }

  updateTitle(title: string): void {
    this.documentTemplateService.updateTitle(this.documentTemplateId, title).subscribe(
      template => this.documentTemplate.title = template.title
    );
  }

  onContentUpdate(content: LabReportContent): void {
    this.contentDebouncer.setValue(content);
  }

  saveContent(content: LabReportContent): void {
    this.documentTemplateService.updateContent(this.documentTemplateId, content).subscribe();
  }

  delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_document_template',
      content: 'biox.delete_document_template_confirmation',
      translateTitleAndContent: true,
      observable: this.documentTemplateService.delete(this.documentTemplateId),
      successMessage: 'biox.document_template_deleted',
      translateMessage: true
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


  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }
}

