import { Component, HostListener, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import {
  LabTypeDialogComponent,
  LabTypeDialogInput,
} from '../../../../lab-core/entity-module/lab-type-core/component/lab-type-dialog/lab-type-dialog.component';
import { FlDialogService } from '@monorepo/front-core-lib';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { Observable, Subscription } from 'rxjs';
import { LabProgressBar } from '../../../../lab-core/model/entities/lab-progress-bar.entity';
import { map } from 'rxjs/operators';
import {
  LabProgressBarInfoDialogComponent,
} from '../../../../lab-core/entity-module/lab-progress-bar-core/component/lab-progress-bar-info-dialog/lab-progress-bar-info-dialog.component';
import { LabProcess } from '../../../../lab-core/model/entities/process/lab-process.entity';
import {
  LabLogBetweenDatesDialogInput,
  LabLogsBetweenDatesDialogComponent,
} from '../../../../lab-core/entity-module/lab-log-core/lab-logs-between-dates-dialog/lab-logs-between-dates-dialog.component';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { DateTime } from 'luxon';
import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import { TdParamSpecVisibility, TdTypingName } from '@monorepo/technical-doc';
import { CoCommunityHelperService } from '@monorepo/community-lib';
import {
  LabSystemConfigDialogComponent,
} from '../../../../lab-core/entity-module/lab-system-core/component/lab-system-config-dialog/lab-system-config-dialog.component';
import {
  LabMonitorBetweenDatesDialogComponent,
  LabMonitorBetweenDatesDialogInput,
} from '../../../../lab-core/entity-module/lab-monitor-core/lab-monitor-between-dates-dialog/lab-monitor-between-dates-dialog.component';
import { LabProcessService } from '../../../../lab-core/entity-service/lab-process.service';
import { LabTaskGeneratorService } from '../../../../lab-core/service/lab-task-generator.service';
import {
  LabShareAgentCommunityDialogComponent,
} from '../../../../lab-core/entity-module/lab-type-core/component/lab-share-agent-community-dialog/lab-share-agent-community-dialog.component';
import { LabCreateCommunityAgentVersionResDto } from '../../../../lab-core/model/entities/lab-agent.entity';
import {
  LabProcessEditStyleDialogComponent,
  LabProcessEditStyleDialogInputData,
} from '../lab-process-edit-style-dialog/lab-process-edit-style-dialog.component';

/**
 * Complete dashboard to edit, view and run a workflow node
 */
@Component({
  selector: 'lab-process-dashboard',
  templateUrl: './lab-process-dashboard.component.html',
  styleUrls: ['./lab-process-dashboard.component.scss'],
  providers: [LabProcessDashboardConfigState],
})
export class LabProcessDashboardComponent implements OnInit, OnDestroy {
  private nodeState = inject(LabWorkflowNodeDetailState);
  private scenarioState = inject(LabScenarioDetailPageState);
  private dialogService = inject(FlDialogService);
  private processService = inject(LabProcessService);
  private dashboardState = inject(LabProcessDashboardConfigState);
  private workflowEditConfig = inject(LabWorkflowEditConfig);
  private taskGeneratorService = inject(LabTaskGeneratorService);
  private communityHelper = inject(CoCommunityHelperService);

  process$ = this.nodeState.getProcess$();
  nodeProcess$ = this.nodeState.getNode$();

  isEditable$ = this.scenarioState.isEditable$();
  isWaiting$ = this.scenarioState.getScenario$().pipe(map((scenario) => scenario.isWaiting()));

  isPyAgent$ = this.nodeState
    .getProcess$()
    .pipe(map((process) => process.processTypingName === TdTypingName.task.pyAgent));

  isAgent$ = this.nodeState.getProcess$().pipe(map((process) => process.isAgent));

  isTask$ = this.nodeState
    .getProcess$()
    .pipe(map((process) => process.processTypingName.slice(0, 4) === 'TASK'));

  isCommunityAgent: boolean;

  isCodeShown: WritableSignal<boolean> = signal<boolean>(false);

  processSubscription: Subscription;

  ngOnInit(): void {
    this.processSubscription = this.nodeState.getProcess$().subscribe((process) => {
      if (process?.communityAgentVersionId != null) {
        this.isCommunityAgent = true;
        this.isCodeShown.set(process.config.specs['code']?.visibility == 'public');
      }
    });
  }

  openTypingDoc(typingName: string): void {
    const data: LabTypeDialogInput = {
      typingName: typingName,
    };
    this.dialogService.openMediumDialog(LabTypeDialogComponent, {
      data: data,
      panelClass: 'g-dialog-main-background',
    });
  }

  saveConfigAndRunProcess(process: LabProcess): void {
    this.dashboardState.saveCurrentTaskConfig().subscribe((result) => {
      if (result == null || result.status === 'success') {
        this.workflowEditConfig.runProcess(process.parentProtocolId, process.instanceName);
      }
    });
  }

  // save config on ctrl + s
  @HostListener('window:keydown', ['$event'])
  private keyEvent(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
      // prevent saving when there is another dialog opened
      if (this.dialogService.numberOfOpenedDialog() <= 1) {
        this.saveConfig();
        event.preventDefault();
      }
    }
  }

  saveConfig(): void {
    this.dashboardState.saveCurrentTaskConfig();
  }

  openProgressDetails(): void {
    const progressBar$: Observable<LabProgressBar> = this.process$.pipe(
      map((process) => process.progressBar)
    );

    this.dialogService.openBigDialog(LabProgressBarInfoDialogComponent, { data: progressBar$ });
  }

  openProcessLogs(process: LabProcess): void {
    const input: LabLogBetweenDatesDialogInput = {
      title: process.instanceName,
      loadFunction: (fromDatePage?: DateTime) =>
        this.processService.getProcessLogs(process.getProcessType(), process.id, fromDatePage),
      downloadUrl: this.processService.getDownloadProcessLogUrl(process.getProcessType(), process.id),
    };

    this.dialogService.openBigDialog(LabLogsBetweenDatesDialogComponent, { data: input });
  }

  openProcessMonitor(process: LabProcess): void {
    const input: LabMonitorBetweenDatesDialogInput = {
      title: process.instanceName,
      monitor$: this.processService.getProcessMonitor(process.getProcessType(), process.id),
    };

    this.dialogService.openBigDialog(LabMonitorBetweenDatesDialogComponent, { data: input });
  }

  resetProcess(): void {
    this.nodeState.resetProcess();
  }

  convertAgentCodeToTask(process: LabProcess): void {
    this.taskGeneratorService.generateTaskCodeFromAgent(process.id).subscribe();
  }

  openPipPackageList(): void {
    this.dialogService.openSmallDialog(LabSystemConfigDialogComponent);
  }

  downloadAgentFile(process: LabProcess): void {
    this.taskGeneratorService.generateAgentFile(process.parentProtocolId, process.id).subscribe();
  }

  triggerCodeShown(process: LabProcess, newVisibility: TdParamSpecVisibility): void {
    this.nodeState.updateCommunityAgentCodeParamsVisibility(process, newVisibility);
  }

  openShareCommunityAgentDialog(process: LabProcess, onlyUpdate = false): void {
    this.dialogService
      .openMediumDialog(LabShareAgentCommunityDialogComponent, {
        data: {
          processId: process.id,
          agentVersionId: process.communityAgentVersionId,
          onlyUpdate: onlyUpdate,
        },
      })
      .afterClosed()
      .subscribe((res: LabCreateCommunityAgentVersionResDto) => {
        if (res) {
          window.open(
            this.communityHelper.getAgentVersionUrl(res.id, res.title, res.agent_version),
            '_blank'
          );
        }
      });
  }

  openProcessEditStyleDialog(process: LabProcess): void {
    const dialogData: LabProcessEditStyleDialogInputData = {
      mode: 'update',
      object: process,
    };

    this.dialogService
      .openSmallDialog(LabProcessEditStyleDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((process: LabProcess) => {
        if (process) {
          this.scenarioState.refreshProcess(process);
        }
      });
  }

  updateProcessName(process: LabProcess, newName: string): void {
    this.nodeState.updateProcessName(process, newName);
  }

  duplicateTask(process: LabProcess): void {
    this.workflowEditConfig.duplicateProcess(process.instanceName, process.name);
  }

  ngOnDestroy(): void {
    this.processSubscription?.unsubscribe();
  }
}
