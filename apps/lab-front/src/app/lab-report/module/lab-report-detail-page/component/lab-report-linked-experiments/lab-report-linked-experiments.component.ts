import {Component, OnDestroy, OnInit} from '@angular/core';
import {LabReportService} from '../../../../../lab-core/entity-service/lab-report.service';
import {
  FlArrayObs,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  LabSelectExperimentDialogComponent
} from '../../../../../lab-core/entity-module/lab-experiment-core/component/lab-select-experiment-dialog/lab-select-experiment-dialog.component';
import {LabExperiment} from '../../../../../lab-core/model/entities/lab-experiment.entity';
import {Subscription} from 'rxjs';
import {LabReportDetailPageState} from '../../lab-report-detail-page.state';

/**
 * Component to list the linked experiment of a report with
 * the possibility to delete or add a new
 */
@Component({
  selector: 'lab-report-linked-experiments',
  templateUrl: './lab-report-linked-experiments.component.html',
  styleUrls: ['./lab-report-linked-experiments.component.scss']
})
export class LabReportLinkedExperimentsComponent implements OnInit, OnDestroy {

  experiments: FlArrayObs<LabExperiment>;

  canEdit: boolean = false;

  columns: FlTableColumnStatic<LabExperiment>[];

  private readonly actionName: string = 'report-link-experiment';

  private subscription: Subscription;

  constructor(private state: LabReportDetailPageState,
              private reportService: LabReportService,
              private dialogService: FlDialogService,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    // refresh the can edit bool
    this.state.getReport$().subscribe(
      report => {
        this.canEdit = !report.isValidated;
        this.columns = this.canEdit ? ['title', 'unlinked'] : ['title'];
      }
    );

    this.experiments = new FlEntityArrayObs(this.reportService.getExperimentByReports(this.state.currentReport.id));

    this.subscription = this.actionService.getResult$(this.actionName).subscribe(
      result => this.onAddAction(result)
    );
  }

  private onAddAction(result: FlPortalActionResult<LabExperiment>): void {
    if (result.status === 'success') {
      this.experiments.addItem(result.result);
    }
  }

  linkExperiment(): void {
    this.dialogService.openBigDialog(LabSelectExperimentDialogComponent).afterClosed().subscribe(
      experiment => this.selectExperimentClosed(experiment)
    );
  }

  private selectExperimentClosed(experiment?: LabExperiment): void {
    if (experiment) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.reportService.addExperiment(this.state.currentReport.id, experiment.id),
        text: {text: 'biox.report_link_experiment', translateText: true},
      }, true);
    }
  }

  unlinkExperiment(experiment: LabExperiment): void {
    this.reportService.removeExperimentWithConfirmation(this.state.currentReport.id, experiment.id).subscribe(
      result => this.unlinkClosed(result, experiment)
    );
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, experiment: LabExperiment): void {
    if (result.choice) {
      this.experiments.removeItem(experiment);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
