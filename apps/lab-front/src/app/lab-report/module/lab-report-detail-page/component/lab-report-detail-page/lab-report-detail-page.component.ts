import {Component, OnDestroy, OnInit} from '@angular/core';
import {LabReport, LabReportContent} from '../../../../../lab-core/model/entities/lab-report.entity';
import {LabReportService} from '../../../../../lab-core/entity-service/lab-report.service';
import {ActivatedRoute} from '@angular/router';
import {FlConfirmDialogInput, FlConfirmDialogResult, FlDebouncer, FlDialogService} from '@monorepo/front-core-lib';
import {
  LabReportFormDialogComponent,
  LabReportFormDialogInput
} from '../../../../../lab-core/entity-module/lab-report-core/component/lab-report-form-dialog/lab-report-form-dialog.component';
import {LabRouterService} from '../../../../../lab-core/service/lab-router.service';
import {LabReportDetailPageState} from '../../lab-report-detail-page.state';
import {Observable} from 'rxjs';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput
} from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import {LabProject} from '../../../../../lab-core/model/entities/lab-project.class';
import {LabReportTemplateService} from '../../../../../lab-core/entity-service/lab-report-template.service';
import {LabReportTemplate} from '../../../../../lab-core/model/entities/lab-report-template.entity';
import {LabReportTextEditorConfig} from '../../lab-report-text-editor-config.class';

@Component({
  selector: 'lab-report-detail-page',
  templateUrl: './lab-report-detail-page.component.html',
  styleUrls: ['./lab-report-detail-page.component.scss'],
  providers: [LabReportDetailPageState]
})
export class LabReportDetailPageComponent implements OnInit, OnDestroy {

  report$: Observable<LabReport>;
  content: LabReportContent;

  textEditorConfig: LabReportTextEditorConfig;

  syncObjectFunc: (id: string) => Observable<LabReport>;

  createTemplateLoading: boolean = false;

  private contentDebouncer: FlDebouncer<LabReportContent>;

  constructor(private reportService: LabReportService,
              private state: LabReportDetailPageState,
              private route: ActivatedRoute,
              private dialogService: FlDialogService,
              private routerService: LabRouterService,
              private reportTemplateService: LabReportTemplateService) {
  }

  ngOnInit(): void {
    this.syncObjectFunc = (id: string) => this.reportService.syncWithSpace(id);
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
    this.state.init(id);
    this.textEditorConfig = new LabReportTextEditorConfig(id);
    this.report$ = this.state.getReport$();
    this.state.getContent$().subscribe(
      content => this.content = content
    );
  }

  updateTitle(title: string): void {
    this.reportService.updateTitle(this.state.currentReport.id, title).subscribe(
      report => this.state.updateReport(report)
    );
  }

  updateProject(project: LabProject): void {
    this.reportService.updateProject(this.state.currentReport.id, project?.id ?? null).subscribe(
      report => this.state.updateReport(report)
    );
  }

  updateReport(): void {
    const report: LabReport = this.state.currentReport;
    const input: LabReportFormDialogInput = {
      mode: 'update',
      reportId: report.id,
      object: {
        title: report.title,
        project: report.project,
        template: null,
      },
      disableProject: report.isSynced
    };

    this.dialogService.openSmallDialog(LabReportFormDialogComponent, {data: input}).afterClosed().subscribe(
      report => this.updateReportClosed(report)
    );
  }

  private updateReportClosed(report ?: LabReport): void {
    if (report) {
      this.state.updateReport(report);
    }
  }

  onContentUpdate(content: LabReportContent): void {
    this.contentDebouncer.setValue(content);
  }

  saveContent(content: LabReportContent): void {
    this.reportService.updateContent(this.state.currentReport.id, content).subscribe(
      (value) => this.saveContentSuccess(value),
    );
  }

  private saveContentSuccess(content: LabReportContent): void {
    this.state.updateContent(content);
  }

  validate(): void {
    const report = this.state.currentReport;

    const input: LabValidateObjectDialogInput = {
      title: 'biox.validate_report',
      validate: (project: LabProject): Observable<any> => this.reportService.validate(report.id, project.id),
      project: report.project,
      helpText: 'biox.validate_report_help_text',
      successMessage: 'biox.report_validated'
    };

    this.dialogService.openSmallDialog(LabValidateObjectDialogComponent, {data: input}).afterClosed().subscribe(
      result => this.onReportUpdate(result)
    );
  }

  onReportUpdate(report?: LabReport): void {
    if (report) {
      this.state.updateReport(report);
    }
  }

  delete(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.delete_report',
      content: 'biox.delete_report_confirmation',
      translateTitleAndContent: true,
      observable: this.reportService.delete(this.state.currentReport.id),
      successMessage: 'biox.report_deleted',
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

  archiveReport(): void {
    const report = this.state.currentReport;

    let input: FlConfirmDialogInput = null;
    if (report.isArchived) {
      input = {
        title: 'biox.unarchive_report',
        content: 'biox.unarchive_report_confirmation',
        translateTitleAndContent: true,
        observable: this.reportService.unarchive(report.id),
        successMessage: 'biox.report_unarchived',
        translateMessage: true
      };
    } else {
      input = {
        title: 'biox.archive_report',
        content: 'biox.archive_report_confirmation',
        translateTitleAndContent: true,
        observable: this.reportService.archive(report.id),
        successMessage: 'biox.report_archived',
        translateMessage: true
      };
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onArchiveClosed(result)
    );
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LabReport>): void {
    if (result.choice) {
      this.state.updateReport(result.result);
    }
  }

  createReportTemplate(): void {
    if (this.createTemplateLoading) return;
    this.createTemplateLoading = true;
    this.reportTemplateService.createFromReport(this.state.currentReport.id).subscribe({
      next: reportTemplate => this.createReportSuccess(reportTemplate),
      error: () => this.createTemplateLoading = false
    });
  }

  private createReportSuccess(reportTemplate: LabReportTemplate): void {
    this.routerService.navigatorToReportTemplateDetail(reportTemplate.id);
  }

  ngOnDestroy(): void {
    this.contentDebouncer.complete();
  }


}
