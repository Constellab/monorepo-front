import {Component, OnInit} from '@angular/core';
import {LabWorkflowNodeDetailState} from '../../state/lab-workflow-node-detail.state';
import {
  LabTypeDialogComponent,
  LabTypeDialogInput
} from '../../../../../lab-core/entity-module/lab-type-core/component/lab-type-dialog/lab-type-dialog.component';
import {FlDialogService} from '@monorepo/front-core-lib';
import {LabExperimentDetailPageState} from '../../state/lab-experiment-detail-page.state';
import {Observable} from 'rxjs';
import {LabProgressBar} from '../../../../../lab-core/model/entities/lab-progress-bar.entity';
import {map} from 'rxjs/operators';
import {
  LabProgressBarInfoDialogComponent
} from '../../../../../lab-core/entity-module/lab-progress-bar-core/component/lab-progress-bar-info-dialog/lab-progress-bar-info-dialog.component';
import {LabProcess} from '../../../../../lab-core/model/entities/process/lab-process.entity';
import {
  LabLogBetweenDatesDialogInput,
  LabLogsBetweenDatesDialogComponent
} from '../../../../../lab-core/entity-module/lab-log-core/lab-logs-between-dates-dialog/lab-logs-between-dates-dialog.component';
import {
  LabMonitorBetweenDatesDialogComponent,
  LabMonitorBetweenDatesDialogInput
} from '../../../../../lab-core/entity-module/lab-monitor-core/lab-monitor-between-dates-dialog/lab-monitor-between-dates-dialog.component';
import {LabProcessService} from '../../../../../lab-core/entity-service/lab-process.service';
import {LabWorkflowNodeDashboardState} from '../../state/lab-workflow-node-dashboard.state';

/**
 * Complete dashboard to edit, view and run a workflow node
 */
@Component({
  selector: 'lab-workflow-node-dashboard',
  templateUrl: './lab-workflow-node-dashboard.component.html',
  styleUrls: ['./lab-workflow-node-dashboard.component.scss'],
  providers: [LabWorkflowNodeDashboardState]
})
export class LabWorkflowNodeDashboardComponent implements OnInit {

  process$ = this.nodeState.getProcess$();

  isEditable$ = this.experimentState.isEditable$();
  isRunning$ = this.experimentState.getExperiment$().pipe(
    map(experiment => experiment.isRunning())
  );
  isWaiting$ = this.experimentState.getExperiment$().pipe(
    map(experiment => experiment.isWaiting())
  );

  constructor(private nodeState: LabWorkflowNodeDetailState,
              private experimentState: LabExperimentDetailPageState,
              private dialogService: FlDialogService,
              private processService: LabProcessService,
              private dashboardState: LabWorkflowNodeDashboardState) {
  }

  ngOnInit(): void {
  }

  openTypingDoc(typingName: string): void {
    const data: LabTypeDialogInput = {
      typingName: typingName
    };
    this.dialogService.openMediumDialog(LabTypeDialogComponent, {data: data});
  }

  saveConfigAndStartExperiment(): void {
    this.dashboardState.saveCurrentTaskConfig().subscribe(
      (result) => {
        if (result && result.status === 'success') {
          this.experimentState.start();
        }
      }
    );
  }

  saveConfig(): void{
    this.dashboardState.saveCurrentTaskConfig();
  }

  openProgressDetails(): void {
    const progressBar$: Observable<LabProgressBar> = this.process$.pipe(
      map(process => process.progressBar)
    );

    this.dialogService.openMediumDialog(LabProgressBarInfoDialogComponent, {data: progressBar$});
  }

  openProcessLogs(process: LabProcess): void {
    const input: LabLogBetweenDatesDialogInput = {
      title: process.instanceName,
      logs$: this.processService.getProcessLogs(process.getProcessType(), process.id),
      downloadUrl: this.processService.getDownloadProcessLogUrl(process.getProcessType(), process.id)
    };

    this.dialogService.openBigDialog(LabLogsBetweenDatesDialogComponent, {data: input});
  }

  openProcessMonitor(process: LabProcess): void {
    const input: LabMonitorBetweenDatesDialogInput = {
      title: process.instanceName,
      monitor$: this.processService.getProcessMonitor(process.getProcessType(), process.id)
    };

    this.dialogService.openBigDialog(LabMonitorBetweenDatesDialogComponent, {data: input});
  }

  resetProcess(): void {
    this.nodeState.resetProcess();
  }
}
