import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialogContent } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { CoCommunityHelperService, CoCommunityLibModule } from '@monorepo/community-lib';
import { FlWarningDialogComponent, FlWarningDialogData } from '@monorepo/front-core-lib/fl-dialog';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlFormModule } from '@monorepo/front-core-lib/fl-form';
import { FlStatusModule } from '@monorepo/front-core-lib/fl-status';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTranslatableText, FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LiCreateCommunityAgentVersionResDto,
  LiProcess,
  LiProcessService,
  LiProtocolService,
  LiTaskGeneratorService,
} from '@monorepo/lab-lib/li-core';
import { LiLogBetweenDatesDialogInput, LiLogsBetweenDatesDialogComponent } from '@monorepo/lab-lib/li-log';
import {
  LiMonitorBetweenDatesDialogComponent,
  LiMonitorBetweenDatesDialogInput,
} from '@monorepo/lab-lib/li-monitor';
import { LiProcessRunInfoData, LiProgressBarInfoDialogComponent } from '@monorepo/lab-lib/li-progress-bar';
import { LiSystemConfigDialogComponent } from '@monorepo/lab-lib/li-system';
import {
  LiShareAgentCommunityDialogComponent,
  LiShareAgentCommunityDialogData,
  LiShareAgentNewVersionCommunityDialogComponent,
  LiTypeDialogComponent,
  LiTypeDialogInput,
} from '@monorepo/lab-lib/li-type';
import { TdParamSpecVisibility, TdTypingName } from '@monorepo/technical-doc';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTime } from 'luxon';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { LabCoServiceConfig } from '../../../../lab-core/lab-co-service-config.service';
import { LabWorkflowEditConfig } from '../../model/lab-workflow-edit-config.class';
import { LabProcessDashboardConfigState } from '../../state/lab-process-dashboard-config-state.service';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import { LabWorkflowNodeDetailState } from '../../state/lab-workflow-node-detail.state';
import { LabConfigureProcessComponent } from '../lab-configure-process/lab-configure-process.component';
import {
  LabProcessEditStyleDialogComponent,
  LabProcessEditStyleDialogInputData,
} from '../lab-process-edit-style-dialog/lab-process-edit-style-dialog.component';
import { LabProcessIoPanelComponent } from '../lab-process-io-panel/lab-process-io-panel.component';

/**
 * Complete dashboard to edit, view and run a workflow node
 */
@Component({
  selector: 'lab-process-dashboard',
  templateUrl: './lab-process-dashboard.component.html',
  styleUrls: ['./lab-process-dashboard.component.scss'],
  providers: [LabProcessDashboardConfigState],
  imports: [
    MatDialogContent,
    CoCommunityLibModule,
    FlFormModule,
    MatIconButton,
    MatTooltip,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    FlStatusModule,
    FlIconModule,
    LabProcessIoPanelComponent,
    LabConfigureProcessComponent,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabProcessDashboardComponent implements OnInit, OnDestroy {
  private nodeState = inject(LabWorkflowNodeDetailState);
  private scenarioState = inject(LabScenarioDetailPageState);
  private dialogService = inject(FlDialogService);
  private processService = inject(LiProcessService);
  private dashboardState = inject(LabProcessDashboardConfigState);
  private workflowEditConfig = inject(LabWorkflowEditConfig);
  private taskGeneratorService = inject(LiTaskGeneratorService);
  private communityHelper = inject(CoCommunityHelperService);
  private protocolService = inject(LiProtocolService);
  private labCoServiceConfig = inject(LabCoServiceConfig);
  private translateService = inject(FlTranslateService);

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

  communityAgentPageUrl: string;

  ngOnInit(): void {
    this.processSubscription = this.nodeState.getProcess$().subscribe((process) => {
      if (process?.communityAgentVersionId != null) {
        this.isCommunityAgent = true;
        this.setCommunityAgentPageUrl(process.communityAgentVersionId);
        this.isCodeShown.set(process.config.specs['code']?.visibility == 'public');
      }
    });
  }

  openTypingDoc(typingName: string): void {
    const data: LiTypeDialogInput = {
      typingName: typingName,
    };
    this.dialogService.openMediumDialog(LiTypeDialogComponent, {
      data: data,
      panelClass: 'g-dialog-main-background',
    });
  }

  saveConfigAndRunProcess(process: LiProcess): void {
    this.dashboardState.saveCurrentTaskConfig().subscribe((result) => {
      if (result == null || result.status === 'success') {
        this.workflowEditConfig.runProcess(process.parentProtocolId, process.instanceName);
      }
    });
  }

  // save config on ctrl + s
  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent): void {
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
    const data$: Observable<LiProcessRunInfoData> = this.process$.pipe(
      map((process) => ({
        progressBar: process.progressBar,
        brickVersionOnCreate: process.brickVersionOnCreate,
        brickVersionOnRun: process.brickVersionOnRun,
        runBy: process.runBy,
      }))
    );

    this.dialogService.openBigDialog(LiProgressBarInfoDialogComponent, { data: data$ });
  }

  openProcessLogs(process: LiProcess): void {
    const input: LiLogBetweenDatesDialogInput = {
      title: process.instanceName,
      loadFunction: (fromDatePage?: DateTime) =>
        this.processService.getProcessLogs(process.getProcessType(), process.id, fromDatePage),
      downloadUrl: this.processService.getDownloadProcessLogUrl(process.getProcessType(), process.id),
    };

    this.dialogService.openBigDialog(LiLogsBetweenDatesDialogComponent, { data: input });
  }

  openProcessMonitor(process: LiProcess): void {
    const input: LiMonitorBetweenDatesDialogInput = {
      title: process.instanceName,
      monitor$: this.processService.getProcessMonitor(process.getProcessType(), process.id),
    };

    this.dialogService.openBigDialog(LiMonitorBetweenDatesDialogComponent, { data: input });
  }

  resetProcess(): void {
    this.nodeState.resetProcess();
  }

  convertAgentCodeToTask(process: LiProcess): void {
    this.taskGeneratorService.generateTaskCodeFromAgent(process.id).subscribe();
  }

  openPipPackageList(): void {
    this.dialogService.openSmallDialog(LiSystemConfigDialogComponent);
  }

  downloadAgentFile(process: LiProcess): void {
    this.taskGeneratorService.generateAgentFile(process.parentProtocolId, process.id).subscribe();
  }

  triggerCodeShown(process: LiProcess, newVisibility: TdParamSpecVisibility): void {
    this.nodeState.updateCommunityAgentCodeParamsVisibility(process, newVisibility);
  }

  checkAndOpenShareAgentToCommunityDialog(process: LiProcess, newVersion: boolean = false): void {
    const warnings: FlTranslatableText[] = this.checkAgentWarnings(process);
    if (warnings.length > 0) {
      const data: FlWarningDialogData = {
        title: 'li.share_agent_to_community',
        warnings: warnings,
        confirmText: 'li.share',
      };

      this.dialogService
        .openSmallDialog(FlWarningDialogComponent, { data: data })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.onConfirmShareAgent(process, newVersion);
          }
        });
    } else {
      this.onConfirmShareAgent(process, newVersion);
    }
  }

  openShareCommunityAgentNewVersionDialog(process: LiProcess): void {
    this.dialogService
      .openMediumDialog(LiShareAgentNewVersionCommunityDialogComponent, {
        data: {
          processId: process.id,
          agentVersionId: process.communityAgentVersionId,
        } as LiShareAgentCommunityDialogData,
      })
      .afterClosed()
      .subscribe((res: LiCreateCommunityAgentVersionResDto) => this.onShareAgentRes(res));
  }

  openShareCommunityAgentDialog(process: LiProcess): void {
    this.dialogService
      .openMediumDialog(LiShareAgentCommunityDialogComponent, {
        data: {
          processId: process.id,
          agentVersionId: process.communityAgentVersionId,
        } as LiShareAgentCommunityDialogData,
      })
      .afterClosed()
      .subscribe((res: LiCreateCommunityAgentVersionResDto) => this.onShareAgentRes(res));
  }

  private onShareAgentRes(res: LiCreateCommunityAgentVersionResDto): void {
    if (res) {
      window.open(this.communityHelper.getAgentVersionUrl(res.id, res.title, res.agent_version), '_blank');
    }
  }

  openProcessEditStyleDialog(process: LiProcess): void {
    const dialogData: LabProcessEditStyleDialogInputData = {
      mode: 'update',
      object: process,
    };

    this.dialogService
      .openSmallDialog(LabProcessEditStyleDialogComponent, { data: dialogData })
      .afterClosed()
      .subscribe((process: LiProcess) => {
        if (process) {
          this.scenarioState.refreshProcess(process);
        }
      });
  }

  updateProcessName(process: LiProcess, newName: string): void {
    this.nodeState.updateProcessName(process, newName);
  }

  duplicateTask(process: LiProcess): void {
    this.workflowEditConfig.duplicateProcess(process.instanceName, process.name);
  }

  ngOnDestroy(): void {
    this.processSubscription?.unsubscribe();
  }

  private setCommunityAgentPageUrl(agentVersionId: string): void {
    this.protocolService.getCurrentAgent(agentVersionId).subscribe((agent) => {
      if (agent) this.communityAgentPageUrl = this.labCoServiceConfig.getCommunityAgentPageUrl(agent.id);
    });
  }

  private onConfirmShareAgent(process: LiProcess, newVersion: boolean): void {
    if (newVersion) {
      this.openShareCommunityAgentNewVersionDialog(process);
    } else {
      this.openShareCommunityAgentDialog(process);
    }
  }

  private checkAgentWarnings(process: LiProcess): FlTranslatableText[] {
    // Check if warnings are
    const warnings: string[] = [];

    if (Object.keys(process.config.specs?.params?.additional_info?.specs)?.length == 0) {
      // Warning on no additional info params specs defined
      warnings.push('biox.share_agent_warning.no_config');
    }

    for (const param of Object.keys(process.config.specs.params.additional_info.specs)) {
      const spec = process.config.specs.params.additional_info.specs[param];
      if (spec.short_description == null || spec.short_description === '') {
        // Warning on param spec without description set
        warnings.push('biox.share_agent_warning.parameter_without_description');
        break;
      }
    }

    for (const input_key of Object.keys(process.inputs.ports)) {
      const input = process.inputs.ports[input_key];
      for (const resource_type of input.specs.resource_types) {
        if (resource_type.typing_name === TdTypingName.resource.resource) {
          // Warning if an input port of the resource type Resource is found
          warnings.push('biox.share_agent_warning.input_port_with_type_resource');
          break;
        }
      }
      if (warnings.includes('biox.share_agent_warning.input_port_with_type_resource')) {
        break;
      }
    }

    for (const output_key of Object.keys(process.outputs.ports)) {
      const output = process.outputs.ports[output_key];
      for (const resource_type of output.specs.resource_types) {
        if (resource_type.typing_name === TdTypingName.resource.resource) {
          // Warning if an output port of the resource type Resource is found
          warnings.push('biox.share_agent_warning.output_port_with_type_resource');
          break;
        }
      }
      if (warnings.includes('biox.share_agent_warning.output_port_with_type_resource')) {
        break;
      }
    }
    return warnings;
  }
}
