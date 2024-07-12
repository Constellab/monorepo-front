import { Component, OnInit } from '@angular/core';
import { LabExperiment } from '../../../../../lab-core/model/entities/lab-experiment.entity';
import { LabExperimentDetailPageState } from '../../state/lab-experiment-detail-page.state';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlSnackBarService,
  FlTranslateService
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import {
  LabProgressBarInfoDialogComponent
} from '../../../../../lab-core/entity-module/lab-progress-bar-core/component/lab-progress-bar-info-dialog/lab-progress-bar-info-dialog.component';
import { map } from 'rxjs/operators';
import { LabExperimentService } from '../../../../../lab-core/entity-service/lab-experiment.service';
import { LabRouterService } from '../../../../../lab-core/service/lab-router.service';
import { LabReport } from '../../../../../lab-core/model/entities/lab-report.entity';
import {
  LabReportFormDialogComponent,
  LabReportFormDialogInput
} from '../../../../../lab-core/entity-module/lab-report-core/component/lab-report-form-dialog/lab-report-form-dialog.component';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput
} from '../../../../../lab-core/entity-module/lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabProject } from '../../../../../lab-core/model/entities/lab-project.class';
import { LabQueueService } from '../../../../../lab-core/entity-service/lab-queue.service';
import {
  LabLogBetweenDatesDialogInput,
  LabLogsBetweenDatesDialogComponent
} from '../../../../../lab-core/entity-module/lab-log-core/lab-logs-between-dates-dialog/lab-logs-between-dates-dialog.component';
import {
  LabMonitorBetweenDatesDialogComponent,
  LabMonitorBetweenDatesDialogInput
} from '../../../../../lab-core/entity-module/lab-monitor-core/lab-monitor-between-dates-dialog/lab-monitor-between-dates-dialog.component';
import { LabProcessService } from '../../../../../lab-core/entity-service/lab-process.service';
import {
  LabProtocolTemplateFormDialogComponent,
  LabProtocolTemplateFormDialogInput
} from '../../../../../lab-core/entity-module/lab-protocol-template-core/component/lab-protocol-template-form-dialog/lab-protocol-template-form-dialog.component';
import { LabProtocolService } from '../../../../../lab-core/entity-service/lab-protocol.service';
import { DateTime } from 'luxon';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput
} from '../../../../../lab-core/entity-module/lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import {
  LabNavigableEntityService,
  LabNavigableImpactConfig
} from '../../../../../lab-core/entity-module/lab-navigable-entity-core/lab-navigable-entity.service';
import {
  LabSharedEntityInfoDialogComponent,
  LabSharedEntityInfoDialogInput
} from '../../../../../lab-core/entity-module/lab-share-core/component/lab-shared-entity-info-dialog/lab-shared-entity-info-dialog.component';

/**
 * Header for the experiment detail page
 */
@Component({
  selector: 'lab-experiment-detail-header',
  templateUrl: './lab-experiment-detail-header.component.html',
  styleUrls: ['./lab-experiment-detail-header.component.scss']
})
export class LabExperimentDetailHeaderComponent implements OnInit {

  experiment$: Observable<LabExperiment>;

  syncObjectFunc: (id: string) => Observable<LabExperiment>;

  constructor(private experimentState: LabExperimentDetailPageState,
              private dialogService: FlDialogService,
              private experimentService: LabExperimentService,
              private routerService: LabRouterService,
              private queueService: LabQueueService,
              private translateService: FlTranslateService,
              private processService: LabProcessService,
              private protocolService: LabProtocolService,
              private snackBarService: FlSnackBarService,
              private labNavigableService: LabNavigableEntityService,
              private actionsService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    this.experiment$ = this.experimentState.getExperiment$();
    this.syncObjectFunc = (id: string) => this.experimentService.syncWithSpace(id);
  }

  updateTitle(title: string): void {
    this.experimentService.updateTitle(this.experimentState.currentExperiment.id, title).subscribe(
      experiment => this.onExperimentUpdate(experiment)
    );
  }

  openValidationDialog(): void {
    const experiment: LabExperiment = this.experimentState.currentExperiment;

    const input: LabValidateObjectDialogInput = {
      title: 'biox.validate_experiment',
      validate: (project: LabProject): Observable<any> =>
        this.experimentService.validateExperiment(experiment.id, project.id),
      project: experiment.project,
      helpText: 'biox.validate_experiment_help_text',
      successMessage: 'biox.experiment_validated'
    };

    this.dialogService.openSmallDialog(LabValidateObjectDialogComponent, { data: input }).afterClosed().subscribe(
      result => this.onExperimentUpdate(result)
    );
  }

  removeExperimentFromQueue(): void {
    const experiment: LabExperiment = this.experimentState.currentExperiment;

    const input: FlConfirmDialogInput = {
      title: 'biox.remove_experiment_from_queue',
      content: 'biox.remove_experiment_from_queue_confirmation',
      translateTitleAndContent: true,
      observable: this.queueService.removeExperimentFromQueue(experiment.id),
      successMessage: 'biox.experiment_removed_from_queue',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onConfirmUpdateClosed(result)
    );
  }

  private onConfirmUpdateClosed(result: FlConfirmDialogResult<LabExperiment>): void {
    if (result.choice) {
      this.experimentState.updateExperiment(result.result);
    }
  }

  onExperimentUpdate(experiment?: LabExperiment): void {
    if (experiment) {
      this.experimentState.updateExperiment(experiment);
    }
  }


  openTagsFormDialog(): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: 'EXPERIMENT',
      entityId: this.experimentState.currentExperiment.id,
      tags: this.experimentState.getTags$()
    };

    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, { data: data });
  }

  openDuplicateConfirmation(): void {
    const experiment = this.experimentState.currentExperiment;

    const input: FlConfirmDialogInput = {
      title: 'biox.clone_experiment',
      content: 'biox.clone_experiment_confirmation',
      translateTitleAndContent: true,
      observable: this.experimentService.cloneExperiment(experiment.id),
      successMessage: 'biox.experiment_cloned',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onDuplicateClosed(result)
    );
  }

  private onDuplicateClosed(result: FlConfirmDialogResult<LabExperiment>): void {
    if (result.choice) {
      this.routerService.navigateToExperimentDetail(result.result.id);
    }
  }

  openCreateReport(): void {
    const experiment = this.experimentState.currentExperiment;

    const input: LabReportFormDialogInput = {
      mode: 'create',
      experimentId: experiment.id,
      project: experiment.project
    };

    this.dialogService.openSmallDialog(LabReportFormDialogComponent, { data: input }).afterClosed().subscribe(
      report => this.onReportCreateClosed(report)
    );
  }

  private onReportCreateClosed(report?: LabReport): void {
    if (report) {
      this.routerService.navigateToReportDetail(report.id);
    }
  }

  openCreateProtocolTemplate(): void {
    const experiment = this.experimentState.currentExperiment;

    const input: LabProtocolTemplateFormDialogInput = {
      mode: 'create',
      protocolId: experiment.protocol.id,
      defaultName: experiment.title,
      defaultDescription: this.experimentState.currentDescription
    };


    this.dialogService.openSmallDialog(LabProtocolTemplateFormDialogComponent,
      { data: input, panelClass: 'g-dialog-main-background' }).afterClosed().subscribe();
  }

  downloadProtocolTemplate(experiment: LabExperiment): void {
    this.actionsService.addAction({
      type: 'download-protocol-template',
      action: this.protocolService.downloadProtocolTemplate(experiment.protocol.id),
      text: { text: 'biox.download_protocol_template', translateText: true }
    });
  }

  resetExperiment(): void {
    const experiment = this.experimentState.currentExperiment;
    const impactData: LabNavigableImpactConfig = {
      title: { text: 'biox.reset_experiment', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.experiment_ressource_used_after', translateText: true, translateParam: {
          param: { title: experiment.title }
        }
      },
      confirm2: 'If you reset the experiment',
      noImpactConfirmText: { text: 'biox.reset_experiment_confirmation', translateText: true },
      checkImpact: () => this.experimentService.checkImpactForResetExperiment(experiment.id),
      callAction: () => this.experimentService.resetExperiment(experiment.id)
    };

    this.labNavigableService.callImpactMethodOnAction(impactData).subscribe(
      result => this.onResetSuccess(result)
    );
  }


  private onResetSuccess(result: FlPortalActionResult<LabExperiment>): void {
    if (result.status === 'success') {
      this.experimentState.updateExperiment(result.result, true);
      this.snackBarService.openSuccessMessage({ text: 'biox.experiment_reset', translateText: true });
    }
  }


  deleteExperiment(): void {
    const experiment = this.experimentState.currentExperiment;

    let content = `</p>${this.translateService.translate('biox.delete_experiment_confirmation')}</p>`;
    if (experiment.isSynced) {
      content += `<p>${this.translateService.translate('biox.delete_experiment_sync_confirmation')}</p>`;
    }

    const impactData: LabNavigableImpactConfig = {
      title: { text: 'biox.delete_experiment', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.experiment_ressource_used_after', translateText: true, translateParam: {
          param: { title: experiment.title }
        }
      },
      noImpactConfirmText: { text: content, translateText: false },
      checkImpact: () => this.experimentService.checkImpactForResetExperiment(experiment.id),
      callAction: () => this.experimentService.deleteExperiment(experiment.id)
    };

    this.labNavigableService.callImpactMethodOnAction(impactData).subscribe(
      result => this.onDeleteSuccess(result)
    );
  }

  private onDeleteSuccess(result: FlPortalActionResult<void>): void {
    if (result.status === 'success') {
      this.snackBarService.openSuccessMessage({ text: 'biox.experiment_deleted', translateText: true });
      this.routerService.navigateToExperimentListRoute();
    }
  }

  archiveExperiment(): void {
    const experiment = this.experimentState.currentExperiment;

    let input: FlConfirmDialogInput;
    if (experiment.isArchived) {
      input = {
        title: 'biox.unarchive_experiment',
        content: 'biox.unarchive_experiment_confirmation',
        translateTitleAndContent: true,
        observable: this.experimentService.unarchiveExperiment(experiment.id),
        successMessage: 'biox.experiment_unarchived',
        translateMessage: true
      };
    } else {
      input = {
        title: 'biox.archive_experiment',
        content: 'biox.archive_experiment_confirmation',
        translateTitleAndContent: true,
        observable: this.experimentService.archiveExperiment(experiment.id),
        successMessage: 'biox.experiment_archived',
        translateMessage: true
      };
    }

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onArchiveClosed(result)
    );
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LabExperiment>): void {
    if (result.choice) {
      this.experimentState.updateExperiment(result.result);
    }
  }

  openProgressInformation(): void {
    this.dialogService.openBigDialog(LabProgressBarInfoDialogComponent,
      {
        data:
          this.experimentState.getMainProtocol$().pipe(
            map(flow => flow.progressBar)
          )
      });
  }

  openProcessLogs(experiment: LabExperiment): void {
    const input: LabLogBetweenDatesDialogInput = {
      title: experiment.title,
      loadFunction: (fromDatePage?: DateTime) => this.processService.getProcessLogs('PROTOCOL', experiment.protocol.id, fromDatePage),
      downloadUrl: this.processService.getDownloadProcessLogUrl('PROTOCOL', experiment.protocol.id)
    };

    this.dialogService.openBigDialog(LabLogsBetweenDatesDialogComponent, { data: input });
  }

  openProcessMonitor(experiment: LabExperiment): void {
    const input: LabMonitorBetweenDatesDialogInput = {
      title: experiment.title,
      monitor$: this.processService.getProcessMonitor('PROTOCOL', experiment.protocol.id)
    };

    this.dialogService.openBigDialog(LabMonitorBetweenDatesDialogComponent, { data: input });
  }

  openShareDialog(experiment: LabExperiment): void {
    const data: LabSharedEntityInfoDialogInput = {
      entityType: 'EXPERIMENT',
      entityId: experiment.id
    };

    this.dialogService.openMediumDialog(LabSharedEntityInfoDialogComponent, {data});
  }


  deleteIntermediateResources(): void {
    const experiment = this.experimentState.currentExperiment;

    const input: FlConfirmDialogInput = {
      title: 'biox.delete_experiment_intermediate_resources',
      content: 'biox.delete_experiment_intermediate_resources_confirmation',
      translateTitleAndContent: true,
      observable: this.experimentService.deleteIntermediateResources(experiment.id),
      successMessage: 'biox.experiment_intermediate_resources_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe(
      result => this.onArchiveClosed(result)
    );
  }

}
