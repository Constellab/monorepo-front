import { Component, Input } from '@angular/core';
import { CaReport } from '../../../../../ca-core/model/entities/project/ca-report.class';
import { CaExperiment } from '../../../../../ca-core/model/entities/project/ca-experiment.class';
import { CaExperimentService } from '../../../../../ca-core/service-api/ca-experiment.service';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs
} from '@monorepo/front-core-lib';
import {
  CaExperimentsListDialogInput,
  CaExperimentsTableDialogComponent
} from '../../../ca-experiment-core/component/ca-experiments-table-dialog/ca-experiments-table-dialog.component';
import { CaReportService } from '../../../../../ca-core/service-api/ca-report.service';
import { CaProjectObjectDetailState } from '../../../ca-project-object-core/state/ca-project-object-detail.state';

@Component({
  selector: 'ca-report-detail',
  templateUrl: './ca-report-detail.component.html',
  styleUrls: ['./ca-report-detail.component.scss']
})
export class CaReportDetailComponent {

  @Input({ required: true }) report: CaReport;

  experiments: FlArrayObs<CaExperiment>;

  constructor(private experimentService: CaExperimentService,
              private dialogService: FlDialogService,
              private reportService: CaReportService,
              private state: CaProjectObjectDetailState) {
  }

  printReport(): void {
    if (window) {
      window.print();
    }
  }

  openExperimentsListDialog(): void {
    this.experiments = new FlEntityArrayObs(this.experimentService.getExperimentsByReport(this.report.id));

    const input: CaExperimentsListDialogInput = {
      experiments: this.experiments,
      title: { text: 'report_associated_experiments', translateText: true }
    };

    this.dialogService.openMediumDialog(CaExperimentsTableDialogComponent, { data: input });
  }

  deleteReport(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_report',
      content: 'delete_report_confirmation',
      translateTitleAndContent: true,
      observable: this.reportService.deleteReport(this.report.id),
      successMessage: 'report_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed()
      .subscribe(result => this.onReportDeleted(result));
  }

  private async onReportDeleted(result: FlConfirmDialogResult): Promise<void> {
    if (result.choice) {
      this.state.navigateToParentFolder();
    }
  }
}
