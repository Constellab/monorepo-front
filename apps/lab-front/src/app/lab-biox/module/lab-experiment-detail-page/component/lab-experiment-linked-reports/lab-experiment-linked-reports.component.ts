import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {LabReport} from '../../../../../lab-core/model/entities/lab-report.entity';
import {
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {Subscription} from 'rxjs';
import {LabReportService} from '../../../../../lab-core/entity-service/lab-report.service';
import {map} from 'rxjs/operators';
import {
  LabSelectReportDialogComponent
} from '../../../../../lab-core/entity-module/lab-report-core/component/lab-select-report-dialog/lab-select-report-dialog.component';

/**
 * Component inside the experiment detail to list the reports linked with the experiment
 */
@Component({
  selector: 'lab-experiment-linked-reports',
  templateUrl: './lab-experiment-linked-reports.component.html',
  styleUrls: ['./lab-experiment-linked-reports.component.scss']
})
export class LabExperimentLinkedReportsComponent implements OnInit, OnDestroy {

  @Input() experimentId: string;

  reports: FlEntityArrayObs<LabReport>;

  columns: FlTableColumnStatic<LabReport>[] = ['title', 'unlink'];

  private readonly actionName: string = 'experiment-link-report';

  private subscription: Subscription;

  constructor(private reportService: LabReportService,
              private dialogService: FlDialogService,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    this.subscription = this.actionService.getResult$(this.actionName).subscribe(
      result => this.onAddAction(result)
    );

    this.reports = new FlEntityArrayObs(this.reportService.getByExperiment(this.experimentId));
  }

  private onAddAction(result: FlPortalActionResult<LabReport>): void {
    if (result.status === 'success') {
      this.reports.addItem(result.result);
    }
  }

  linkExperiment(): void {
    this.dialogService.openBigDialog(LabSelectReportDialogComponent).afterClosed().subscribe(
      report => this.selectReportClosed(report)
    );
  }

  private selectReportClosed(report?: LabReport): void {
    if (report) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.reportService.addExperiment(report.id, this.experimentId).pipe(
          map(() => report) // map the report to get it after the action
        ),
        text: {text: 'biox.experiment_link_report', translateText: true},
      }, true);
    }
  }

  unlinkReport(report: LabReport): void {
    this.reportService.removeExperimentWithConfirmation(report.id, this.experimentId).subscribe(
      result => this.unlinkClosed(result, report)
    );
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, report: LabReport): void {
    if (result.choice) {
      this.reports.removeItem(report);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
