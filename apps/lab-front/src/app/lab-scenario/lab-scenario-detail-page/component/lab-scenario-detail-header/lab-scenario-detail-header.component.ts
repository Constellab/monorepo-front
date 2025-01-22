import { Component, OnInit, inject } from '@angular/core';
import { LabScenario } from '../../../../lab-core/model/entities/lab-scenario.entity';
import { LabScenarioDetailPageState } from '../../state/lab-scenario-detail-page.state';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlPortalActionResult,
  FlPortalActionsService,
  FlSnackBarService,
  FlTranslateService,
} from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { LabProgressBarInfoDialogComponent } from '../../../../lab-core/entity-module/lab-progress-bar-core/component/lab-progress-bar-info-dialog/lab-progress-bar-info-dialog.component';
import { map } from 'rxjs/operators';
import { LabScenarioService } from '../../../../lab-core/entity-service/lab-scenario.service';
import { LabRouterService } from '../../../../lab-core/service/lab-router.service';
import { LabNote } from '../../../../lab-core/model/entities/lab-note.entity';
import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput,
} from '../../../../lab-core/entity-module/lab-note-core/component/lab-note-form-dialog/lab-note-form-dialog.component';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput,
} from '../../../../lab-core/entity-module/lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabFolder } from '../../../../lab-core/model/entities/lab-folder.class';
import { LabQueueService } from '../../../../lab-core/entity-service/lab-queue.service';
import {
  LabLogBetweenDatesDialogInput,
  LabLogsBetweenDatesDialogComponent,
} from '../../../../lab-core/entity-module/lab-log-core/lab-logs-between-dates-dialog/lab-logs-between-dates-dialog.component';
import {
  LabMonitorBetweenDatesDialogComponent,
  LabMonitorBetweenDatesDialogInput,
} from '../../../../lab-core/entity-module/lab-monitor-core/lab-monitor-between-dates-dialog/lab-monitor-between-dates-dialog.component';
import { LabProcessService } from '../../../../lab-core/entity-service/lab-process.service';
import {
  LabScenarioTemplateFormDialogComponent,
  LabScenarioTemplateFormDialogInput,
} from '../../../../lab-core/entity-module/lab-scenario-template-core/component/lab-scenario-template-form-dialog/lab-scenario-template-form-dialog.component';
import { LabProtocolService } from '../../../../lab-core/entity-service/lab-protocol.service';
import { DateTime } from 'luxon';
import {
  LabManageEntityTagsDialogComponent,
  LabManageEntityTagsDialogInput,
} from '../../../../lab-core/entity-module/lab-tag-core/component/lab-manage-entity-tags-dialog/lab-manage-entity-tags-dialog.component';
import {
  LabNavigableEntityService,
  LabNavigableImpactConfig,
} from '../../../../lab-core/entity-module/lab-navigable-entity-core/lab-navigable-entity.service';
import {
  LabSharedEntityInfoDialogComponent,
  LabSharedEntityInfoDialogInput,
} from '../../../../lab-core/entity-module/lab-share-core/component/lab-shared-entity-info-dialog/lab-shared-entity-info-dialog.component';
import { LabScenarioIconsComponent } from '../../../../lab-core/entity-module/lab-scenario-core/component/lab-scenario-icons/lab-scenario-icons.component';
import { FlFormModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-form/fl-form.module';
import { LabSyncObjectButtonComponent } from '../../../../lab-core/entity-module/lab-entity-core/component/lab-sync-object-button/lab-sync-object-button.component';
import { FlStatusModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-status/fl-status.module';
import { NgClass, AsyncPipe } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Header for the scenario detail page
 */
@Component({
  selector: 'lab-scenario-detail-header',
  templateUrl: './lab-scenario-detail-header.component.html',
  styleUrls: ['./lab-scenario-detail-header.component.scss'],
  imports: [
    LabScenarioIconsComponent,
    FlFormModule,
    LabSyncObjectButtonComponent,
    FlStatusModule,
    NgClass,
    MatIconButton,
    MatMenuTrigger,
    MatIcon,
    MatMenu,
    MatMenuItem,
    FlIconModule,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class LabScenarioDetailHeaderComponent implements OnInit {
  private scenarioState = inject(LabScenarioDetailPageState);
  private dialogService = inject(FlDialogService);
  private scenarioService = inject(LabScenarioService);
  private routerService = inject(LabRouterService);
  private queueService = inject(LabQueueService);
  private translateService = inject(FlTranslateService);
  private processService = inject(LabProcessService);
  private protocolService = inject(LabProtocolService);
  private snackBarService = inject(FlSnackBarService);
  private labNavigableService = inject(LabNavigableEntityService);
  private actionsService = inject(FlPortalActionsService);

  scenario$: Observable<LabScenario>;

  syncObjectFunc: (id: string) => Observable<LabScenario>;

  ngOnInit(): void {
    this.scenario$ = this.scenarioState.getScenario$();
    this.syncObjectFunc = (id: string) => this.scenarioService.syncWithSpace(id);
  }

  updateTitle(title: string): void {
    this.scenarioService
      .updateTitle(this.scenarioState.currentScenario.id, title)
      .subscribe((scenario) => this.onScenarioUpdate(scenario));
  }

  openValidationDialog(): void {
    const scenario: LabScenario = this.scenarioState.currentScenario;

    const input: LabValidateObjectDialogInput = {
      title: 'biox.validate_scenario',
      validate: (folder: LabFolder): Observable<any> =>
        this.scenarioService.validateScenario(scenario.id, folder.id),
      folder: scenario.folder,
      helpText: 'biox.validate_scenario_help_text',
      successMessage: 'biox.scenario_validated',
    };

    this.dialogService
      .openSmallDialog(LabValidateObjectDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onScenarioUpdate(result));
  }

  removeScenarioFromQueue(): void {
    const scenario: LabScenario = this.scenarioState.currentScenario;

    const input: FlConfirmDialogInput = {
      title: 'biox.remove_scenario_from_queue',
      content: 'biox.remove_scenario_from_queue_confirmation',
      observable: this.queueService.removeScenarioFromQueue(scenario.id),
      successMessage: 'biox.scenario_removed_from_queue',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onConfirmUpdateClosed(result));
  }

  private onConfirmUpdateClosed(result: FlConfirmDialogResult<LabScenario>): void {
    if (result.choice) {
      this.scenarioState.updateScenario(result.result);
    }
  }

  onScenarioUpdate(scenario?: LabScenario): void {
    if (scenario) {
      this.scenarioState.updateScenario(scenario);
    }
  }

  openTagsFormDialog(): void {
    const data: LabManageEntityTagsDialogInput = {
      entityType: 'SCENARIO',
      entityId: this.scenarioState.currentScenario.id,
      tags: this.scenarioState.getTags$(),
    };

    this.dialogService.openSmallDialog(LabManageEntityTagsDialogComponent, { data: data });
  }

  openDuplicateConfirmation(): void {
    const scenario = this.scenarioState.currentScenario;

    const input: FlConfirmDialogInput = {
      title: 'biox.clone_scenario',
      content: 'biox.clone_scenario_confirmation',
      observable: this.scenarioService.cloneScenario(scenario.id),
      successMessage: 'biox.scenario_cloned',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDuplicateClosed(result));
  }

  private onDuplicateClosed(result: FlConfirmDialogResult<LabScenario>): void {
    if (result.choice) {
      this.routerService.navigateToScenarioDetail(result.result.id);
    }
  }

  openCreateNote(): void {
    const scenario = this.scenarioState.currentScenario;

    const input: LabNoteFormDialogInput = {
      mode: 'create',
      scenarioId: scenario.id,
      folder: scenario.folder,
    };

    this.dialogService
      .openSmallDialog(LabNoteFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((note) => this.onNoteCreateClosed(note));
  }

  private onNoteCreateClosed(note?: LabNote): void {
    if (note) {
      this.routerService.navigateToNoteDetail(note.id);
    }
  }

  openCreateScenarioTemplate(): void {
    const scenario = this.scenarioState.currentScenario;

    const input: LabScenarioTemplateFormDialogInput = {
      mode: 'create',
      protocolId: scenario.protocol.id,
      defaultName: scenario.title,
      defaultDescription: this.scenarioState.currentDescription,
    };

    this.dialogService
      .openSmallDialog(LabScenarioTemplateFormDialogComponent, {
        data: input,
        panelClass: 'g-dialog-main-background',
      })
      .afterClosed()
      .subscribe();
  }

  downloadScenarioTemplate(scenario: LabScenario): void {
    this.actionsService.addAction({
      type: 'download-scenario-template',
      action: this.protocolService.downloadScenarioTemplate(scenario.protocol.id),
      text: { text: 'biox.download_scenario_template', translateText: true },
    });
  }

  resetScenario(): void {
    const scenario = this.scenarioState.currentScenario;
    const impactData: LabNavigableImpactConfig = {
      title: { text: 'biox.reset_scenario', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.scenario_ressource_used_after',
        translateText: true,
        translateParam: {
          param: { title: scenario.title },
        },
      },
      noImpactConfirmText: { text: 'biox.reset_scenario_confirmation', translateText: true },
      checkImpact: () => this.scenarioService.checkImpactForResetScenario(scenario.id),
      callAction: () => this.scenarioService.resetScenario(scenario.id),
    };

    this.labNavigableService
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onResetSuccess(result));
  }

  private onResetSuccess(result: FlPortalActionResult<LabScenario>): void {
    if (result.status === 'success') {
      this.scenarioState.updateScenario(result.result, true);
      this.snackBarService.openSuccessMessage({ text: 'biox.scenario_reset', translateText: true });
    }
  }

  deleteScenario(): void {
    const scenario = this.scenarioState.currentScenario;

    let content = `</p>${this.translateService.translate('biox.delete_scenario_confirmation')}</p>`;
    if (scenario.isSynced) {
      content += `<p>${this.translateService.translate('biox.delete_scenario_sync_confirmation')}</p>`;
    }

    const impactData: LabNavigableImpactConfig = {
      title: { text: 'biox.delete_scenario', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.scenario_ressource_used_after',
        translateText: true,
        translateParam: {
          param: { title: scenario.title },
        },
      },
      noImpactConfirmText: { text: content, translateText: false },
      checkImpact: () => this.scenarioService.checkImpactForResetScenario(scenario.id),
      callAction: () => this.scenarioService.deleteScenario(scenario.id),
    };

    this.labNavigableService
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onDeleteSuccess(result));
  }

  private onDeleteSuccess(result: FlPortalActionResult<void>): void {
    if (result.status === 'success') {
      this.snackBarService.openSuccessMessage({ text: 'biox.scenario_deleted', translateText: true });
      this.routerService.navigateToScenarioListRoute();
    }
  }

  archiveScenario(): void {
    const scenario = this.scenarioState.currentScenario;

    let input: FlConfirmDialogInput;
    if (scenario.isArchived) {
      input = {
        title: 'biox.unarchive_scenario',
        content: 'biox.unarchive_scenario_confirmation',
        observable: this.scenarioService.unarchiveScenario(scenario.id),
        successMessage: 'biox.scenario_unarchived',
      };
    } else {
      input = {
        title: 'biox.archive_scenario',
        content: 'biox.archive_scenario_confirmation',
        observable: this.scenarioService.archiveScenario(scenario.id),
        successMessage: 'biox.scenario_archived',
      };
    }

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onArchiveClosed(result));
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LabScenario>): void {
    if (result.choice) {
      this.scenarioState.updateScenario(result.result);
    }
  }

  openProgressInformation(scenario: LabScenario): void {
    if (scenario.isDraft()) return;

    this.dialogService.openBigDialog(LabProgressBarInfoDialogComponent, {
      data: this.scenarioState.getMainProtocol$().pipe(map((flow) => flow.progressBar)),
    });
  }

  openProcessLogs(scenario: LabScenario): void {
    if (scenario.isDraft()) return;
    const input: LabLogBetweenDatesDialogInput = {
      title: scenario.title,
      loadFunction: (fromDatePage?: DateTime) =>
        this.processService.getProcessLogs('PROTOCOL', scenario.protocol.id, fromDatePage),
      downloadUrl: this.processService.getDownloadProcessLogUrl('PROTOCOL', scenario.protocol.id),
    };

    this.dialogService.openBigDialog(LabLogsBetweenDatesDialogComponent, { data: input });
  }

  openProcessMonitor(scenario: LabScenario): void {
    const input: LabMonitorBetweenDatesDialogInput = {
      title: scenario.title,
      monitor$: this.processService.getProcessMonitor('PROTOCOL', scenario.protocol.id),
    };

    this.dialogService.openBigDialog(LabMonitorBetweenDatesDialogComponent, { data: input });
  }

  openShareDialog(scenario: LabScenario): void {
    const data: LabSharedEntityInfoDialogInput = {
      entityType: 'SCENARIO',
      entityId: scenario.id,
      autoSendConfig: {
        title: 'biox.send_scenario_to_lab',
        helpText: 'biox.send_entity_to_lab_help',
        specs$: this.scenarioService.getExportToLabConfigSpecs(),
      },
      autoSend: (configValues) => this.scenarioService.exportScenarioToLab(scenario.id, configValues),
    };

    this.dialogService.openMediumDialog(LabSharedEntityInfoDialogComponent, { data, autoFocus: false });
  }

  deleteIntermediateResources(): void {
    const scenario = this.scenarioState.currentScenario;

    const input: FlConfirmDialogInput = {
      title: 'biox.delete_scenario_intermediate_resources',
      content: 'biox.delete_scenario_intermediate_resources_confirmation',
      observable: this.scenarioService.deleteIntermediateResources(scenario.id),
      successMessage: 'biox.scenario_intermediate_resources_deleted',
    };

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onArchiveClosed(result));
  }
}
