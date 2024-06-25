import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabReport, LabReportContent } from '../../../../lab-core/model/entities/lab-report.entity';
import { FlConfirmDialogInput, FlConfirmDialogResult, FlDebouncer, FlDialogService } from '@monorepo/front-core-lib';
import { ActivatedRoute } from '@angular/router';
import { LabRouterService } from '../../../../lab-core/service/lab-router.service';
import { LabReportTemplateService } from '../../../../lab-core/entity-service/lab-report-template.service';
import { LabReportTemplate } from '../../../../lab-core/model/entities/lab-report-template.entity';
import { LabReportTemplateTextEditorConfig } from '../../lab-report-template-text-editor-config.class';
import { TeConfig, TeRichTextContent } from '@monorepo/text-editor';

@Component({
  selector: 'lab-report-template-detail-page',
  templateUrl: './lab-report-template-detail-page.component.html',
  styleUrls: ['./lab-report-template-detail-page.component.scss']
})
export class LabReportTemplateDetailPageComponent implements OnInit, OnDestroy {

  reportTemplate: LabReportTemplate;
  content: TeRichTextContent;

  textEditorConfig: TeConfig;

  isLoading: boolean = false;

  private reportTemplateId: string;


  private contentDebouncer: FlDebouncer<TeRichTextContent>;

  constructor(private route: ActivatedRoute,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private reportTemplateService: LabReportTemplateService) {
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

    this.reportTemplateId = id;
    this.textEditorConfig = new LabReportTemplateTextEditorConfig();
    this.isLoading = true;
    this.reportTemplateService.getReportTemplate(id).subscribe({
      next: (reportTemplate) => this.getReportTemplateSuccess(reportTemplate),
      error: () => this.isLoading = false
    });

    this.reportTemplateService.getReportTemplateContent(id).subscribe({
      next: (content) => this.getReportTemplateContentSuccess(content),
    });
  }

  private getReportTemplateSuccess(reportTemplate: LabReportTemplate): void {
    this.reportTemplate = reportTemplate;
    this.isLoading = false;
  }

  private getReportTemplateContentSuccess(content: TeRichTextContent): void {
    this.content = content;
  }

  updateTitle(title: string): void {
    this.reportTemplateService.updateTitle(this.reportTemplateId, title).subscribe(
      report => this.reportTemplate.title = report.title
    );
  }

  onContentUpdate(content: LabReportContent): void {
    this.contentDebouncer.setValue(content);
  }

  saveContent(content: LabReportContent): void {
    this.reportTemplateService.updateContent(this.reportTemplateId, content).subscribe();
  }

  delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_report_template',
      content: 'biox.delete_report_template_confirmation',
      translateTitleAndContent: true,
      observable: this.reportTemplateService.delete(this.reportTemplateId),
      successMessage: 'biox.report_template_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.deletedClosed(result)
    );
  }

  private deletedClosed(result: FlConfirmDialogResult<LabReport>): void {
    if (result.choice) {
      this.routerService.navigateToReportSearch();
    }
  }

  printReport(): void {
    if (window) {
      window.print();
    }
  }


  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }
}

