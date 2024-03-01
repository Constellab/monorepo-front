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
import {DateTime} from 'luxon';
import {LabWorkflowEditConfig} from '../../model/lab-workflow-edit-config.class';
import {TdTypingName} from '@monorepo/technical-doc';
import {LabTaskGeneratorService} from '../../../../../lab-core/service/lab-task-generator.service';
import {LabCreateCommunityLiveTaskVersionResDto} from '../../../../../lab-core/model/entities/lab-live-task.entity';
import {LabCommunityHelper} from '../../../../../lab-core/utils/lab-community.helper';
import {
  LabShareLiveTaskCommunityDialogComponent
} from '../../../../../lab-core/entity-module/lab-type-core/component/lab-share-live-task-community-dialog/lab-share-live-task-community-dialog.component';
import {LtLiveTaskHelper} from '../../../../../../../../../libs/live-task/src/lib/helper/lt-live-task.helper';

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
  nodeProcess$ = this.nodeState.getNode$();

  isEditable$ = this.experimentState.isEditable$();
  isWaiting$ = this.experimentState.getExperiment$().pipe(
    map(experiment => experiment.isWaiting())
  );

  isPyLiveTask$ = this.nodeState.getProcess$().pipe(
    map(process => process.processTypingName === TdTypingName.task.pyLiveTask)
  );

  isLiveTask$ = this.nodeState.getProcess$().pipe(
    map(process => LtLiveTaskHelper.isLiveTask(process.processTypingName))
  );

  constructor(private nodeState: LabWorkflowNodeDetailState,
              private experimentState: LabExperimentDetailPageState,
              private dialogService: FlDialogService,
              private processService: LabProcessService,
              private dashboardState: LabWorkflowNodeDashboardState,
              private workflowEditConfig: LabWorkflowEditConfig,
              private taskGeneratorService: LabTaskGeneratorService) {
  }

  ngOnInit(): void {

  }

  openTypingDoc(typingName: string): void {
    const data: LabTypeDialogInput = {
      typingName: typingName
    };
    this.dialogService.openMediumDialog(LabTypeDialogComponent, {data: data, panelClass: 'g-dialog-main-background'});
  }

  saveConfigAndRunProcess(process: LabProcess): void {
    this.dashboardState.saveCurrentTaskConfig().subscribe(
      (result) => {
        if (result && result.status === 'success') {
          this.workflowEditConfig.runProcess(process.parentProtocolId, process.instanceName);
        }
      }
    );
  }

  saveConfig(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

  openProgressDetails(): void {
    const progressBar$: Observable<LabProgressBar> = this.process$.pipe(
      map(process => process.progressBar)
    );

    this.dialogService.openBigDialog(LabProgressBarInfoDialogComponent, {data: progressBar$});
  }

  openProcessLogs(process: LabProcess): void {
    const input: LabLogBetweenDatesDialogInput = {
      title: process.instanceName,
      loadFunction: (fromDatePage?: DateTime) => this.processService.getProcessLogs(process.getProcessType(), process.id, fromDatePage),
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

  convertLiveTaskCodeToTask(process: LabProcess): void {
    this.taskGeneratorService.generateTaskCodeFromLiveTask(process.id).subscribe();
  }

  downloadLiveTaskFile(process: LabProcess): void {
    this.taskGeneratorService.generateLiveTaskFile(process.id).subscribe();
  }

  openShareCommunityLiveTaskDialog(process: LabProcess): void {
    this.dialogService.openMediumDialog(LabShareLiveTaskCommunityDialogComponent,
      {data: {processId: process.id, liveTaskVersionId: process.communityLiveTaskVersionId}})
      .afterClosed().subscribe((res: LabCreateCommunityLiveTaskVersionResDto) => {
        if (res) {
          window.open(LabCommunityHelper.getLiveTasKVersionUrl(res.live_task_id, res.id), '_blank');
        }
      });
  }
}
