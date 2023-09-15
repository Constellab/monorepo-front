import {Component, OnDestroy, OnInit} from '@angular/core';
import {LabReport, LabReportContent} from '../../../../../lab-core/model/entities/lab-report.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDebouncer,
  FlDialogService,
  FlTextEditorConfig
} from '@monorepo/front-core-lib';
import {ActivatedRoute} from '@angular/router';
import {LabRouterService} from '../../../../../lab-core/service/lab-router.service';
import {LabReportTemplateService} from '../../../../../lab-core/entity-service/lab-report-template.service';
import {LabReportTemplate} from '../../../../../lab-core/model/entities/lab-report-template.entity';
import {LabReportTemplateTextEditorConfig} from '../../lab-report-template-text-editor-config.class';

@Component({
  selector: 'lab-report-template-detail-page',
  templateUrl: './lab-report-template-detail-page.component.html',
  styleUrls: ['./lab-report-template-detail-page.component.scss'],
})
export class LabReportTemplateDetailPageComponent implements OnInit, OnDestroy {

  reportTemplate: LabReportTemplate;
  content: LabReportContent;

  textEditorConfig: FlTextEditorConfig;

  isLoading: boolean = false;

  private reportTemplateId: string;


  private contentDebouncer: FlDebouncer<LabReportContent>;

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
    this.textEditorConfig = new LabReportTemplateTextEditorConfig(this.reportTemplateService, this.dialogService);
    this.isLoading = true;
    this.reportTemplateService.getReportTemplate(id).subscribe({
      next: (reportTemplate) => this.getReportTemplateSuccess(reportTemplate),
      error: () => this.isLoading = false,
    });
  }

  private getReportTemplateSuccess(reportTemplate: LabReportTemplate): void {
    this.reportTemplate = reportTemplate;
    this.content = reportTemplate.content;
    this.isLoading = false;
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
    this.reportTemplateService.updateContent(this.reportTemplateId, content).subscribe(
      (value) => this.saveContentSuccess(value.content),
    );
  }

  private saveContentSuccess(content: LabReportContent): void {
    this.reportTemplate.content = content;
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

