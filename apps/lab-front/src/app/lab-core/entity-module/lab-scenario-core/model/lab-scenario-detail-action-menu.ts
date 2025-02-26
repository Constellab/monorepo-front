import { FlMenuDynamic, FlMenuDynamicService } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { LabScenario } from '../../../model/entities/lab-scenario.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { LabScenarioService } from '../../../entity-service/lab-scenario.service';
import {
  LabScenarioTemplateFormDialogComponent,
  LabScenarioTemplateFormDialogInput,
} from '../../lab-scenario-template-core/component/lab-scenario-template-form-dialog/lab-scenario-template-form-dialog.component';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { LabRouterService } from '../../../service/lab-router.service';
import { LabScenarioActionEvent, LabScenarioActionMenu } from './lab-scenario-action-menu';
import { LabProtocolService } from '../../../entity-service/lab-protocol.service';
import {
  LabValidateObjectDialogComponent,
  LabValidateObjectDialogInput,
} from '../../lab-entity-core/component/lab-validate-object-dialog/lab-validate-object-dialog.component';
import { LabFolder } from '../../../model/entities/lab-folder.class';
import {
  LabNavigableEntityService,
  LabNavigableImpactConfig,
} from '../../lab-navigable-entity-core/lab-navigable-entity.service';
import {
  LabScenarioDetailPageState,
} from '../../../../lab-scenario/lab-scenario-detail-page/state/lab-scenario-detail-page.state';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  LabProgressBarInfoDialogComponent,
} from '../../lab-progress-bar-core/component/lab-progress-bar-info-dialog/lab-progress-bar-info-dialog.component';
import { map, tap } from 'rxjs/operators';
import {
  LabLogBetweenDatesDialogInput,
  LabLogsBetweenDatesDialogComponent,
} from '../../lab-log-core/lab-logs-between-dates-dialog/lab-logs-between-dates-dialog.component';
import { DateTime } from 'luxon';
import {
  LabMonitorBetweenDatesDialogComponent,
  LabMonitorBetweenDatesDialogInput,
} from '../../lab-monitor-core/lab-monitor-between-dates-dialog/lab-monitor-between-dates-dialog.component';
import { LabProcessService } from '../../../entity-service/lab-process.service';
import { LabQueueService } from '../../../entity-service/lab-queue.service';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import { Injector } from '@angular/core';
import { LabTagDatasource } from '../../../model/entities/lab-tag.entity';
import { clRxjsDebug } from '@monorepo/core-lib';

/**
 * Action menu for a lab scenario
 */
export class LabScenarioDetailActionMenu extends LabScenarioActionMenu {
  constructor(
    menuDynamicService: FlMenuDynamicService,
    injector: Injector,
    scenario: LabScenario,
    tags: LabTagDatasource
  ) {
    super(menuDynamicService, injector, scenario, tags);
  }

  public openActionMenuDetail(event: MouseEvent): Observable<LabScenarioActionEvent> {
    const menu = [
      this.getTagsButton(),
      this.getCreateNoteButton(),
      this.getProtocolMenuButton(),
    ];

    if (this.scenario.isInfoEditable() && !this.scenario.isRunningOrWaiting()) {
      menu.push(this.getValidateButton());
    }

    if (this.scenario.protocolIsEditable()) {
      menu.push(this.getResetButton());
    }
    if (!this.scenario.isDraft()) {
      menu.push(this.getMonitorMenuButton());
    }

    menu.push(this.getShareButton());
    menu.push(this.getDuplicateButton());
    menu.push(this.getArchiveButton());

    if (this.scenario.status.value === 'IN_QUEUE') {
      menu.push(this.getRemoveFromQueueButton());
    }

    if (this.scenario.protocolIsEditable()) {
      menu.push(this.getDeleteButton());
    }

    return this.generateMenu(menu, event).pipe(
      clRxjsDebug(),
      tap((event) => {
        this.injector.get(LabScenarioDetailPageState).updateScenario(event.scenario);
      })
    );
  }

  //////////////////////////////////// BUTTONS ////////////////////////////////////

  private getProtocolMenuButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.template',
      icon: 'scenario_template',
      children: [
        {
          type: 'button',
          text: 'biox.create_scenario_template',
          icon: 'scenario_template',
          onClick: () => this.openCreateScenarioTemplate(),
        },
        {
          type: 'button',
          text: 'biox.download_scenario_template',
          icon: 'cloud_download',
          onClick: () => this.downloadScenarioTemplate(this.scenario),
        },
      ],
    };
  }

  private getValidateButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.validate_scenario',
      icon: 'validated',
      onClick: () => this.openValidationDialog(),
    };
  }

  private getResetButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.reset_scenario',
      icon: 'restart_alt',
      onClick: () => this.resetScenario(),
    };
  }

  private getMonitorMenuButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.scenario_monitoring',
      icon: 'troubleshoot',
      children: [
        {
          type: 'button',
          text: 'biox.node_progress_detail',
          icon: 'description',
          onClick: () => this.openProgressInformation(),
        },
        {
          type: 'button',
          text: 'biox.view_process_logs',
          icon: 'description',
          onClick: () => this.openProcessLogs(),
        },
        {
          type: 'button',
          text: 'biox.view_process_monitoring',
          icon: 'troubleshoot',
          onClick: () => this.openProcessMonitor(),
        },
      ],
    };
  }

  private getRemoveFromQueueButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.remove_scenario_from_queue',
      icon: 'stop',
      color: 'warn',
      onClick: () => this.removeScenarioFromQueue(),
    };
  }

  private getDeleteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.delete_scenario',
      icon: 'delete',
      color: 'warn',
      onClick: () => this.deleteScenario(),
    };
  }

  //////////////////////////////////// ACTIONS ////////////////////////////////////

  private openValidationDialog(): void {
    const input: LabValidateObjectDialogInput = {
      title: 'biox.validate_scenario',
      validate: (folder: LabFolder): Observable<any> =>
        this.injector.get(LabScenarioService).validateScenario(this.scenario.id, folder.id),
      folder: this.scenario.folder,
      helpText: 'biox.validate_scenario_help_text',
      successMessage: 'biox.scenario_validated',
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LabValidateObjectDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onConfirmUpdateClosed(result));
  }

  private onConfirmUpdateClosed(result: FlConfirmDialogResult<LabScenario>): void {
    if (result.choice) {
      this.injector.get(LabScenarioDetailPageState).updateScenario(result.result);
    }
    this.subject.complete();
  }

  private openCreateScenarioTemplate(): void {
    const input: LabScenarioTemplateFormDialogInput = {
      mode: 'create',
      protocolId: this.scenario.protocol.id,
      defaultName: this.scenario.title,
      defaultDescription: this.injector.get(LabScenarioDetailPageState).currentDescription,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LabScenarioTemplateFormDialogComponent, {
        data: input,
        panelClass: 'g-dialog-main-background',
      })
      .afterClosed()
      .subscribe();
  }

  private downloadScenarioTemplate(scenario: LabScenario): void {
    this.injector.get(FlPortalActionsService).addAction({
      type: 'download-scenario-template',
      action: this.injector.get(LabProtocolService).downloadScenarioTemplate(scenario.protocol.id),
      text: { text: 'biox.download_scenario_template', translateText: true },
    });
  }

  private resetScenario(): void {
    const impactData: LabNavigableImpactConfig = {
      title: { text: 'biox.reset_scenario', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.scenario_ressource_used_after',
        translateText: true,
        translateParam: {
          param: { title: this.scenario.title },
        },
      },
      noImpactConfirmText: { text: 'biox.reset_scenario_confirmation', translateText: true },
      checkImpact: () => this.injector.get(LabScenarioService).checkImpactForResetScenario(this.scenario.id),
      callAction: () => this.injector.get(LabScenarioService).resetScenario(this.scenario.id),
    };

    this.injector
      .get(LabNavigableEntityService)
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onResetSuccess(result));
  }

  private onResetSuccess(result: FlPortalActionResult<LabScenario>): void {
    if (result.status === 'success') {
      this.injector.get(LabScenarioDetailPageState).updateScenario(result.result, true);
      this.injector.get(FlSnackBarService).openSuccessMessage({
        text: 'biox.scenario_reset',
        translateText: true,
      });
    }
  }

  public openProgressInformation(): void {
    this.injector
      .get(FlDialogService)
      .openBigDialog(LabProgressBarInfoDialogComponent, {
        data: this.injector
          .get(LabScenarioDetailPageState)
          .getMainProtocol$()
          .pipe(map((flow) => flow.progressBar)),
      })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private openProcessLogs(): void {
    const input: LabLogBetweenDatesDialogInput = {
      title: this.scenario.title,
      loadFunction: (fromDatePage?: DateTime) =>
        this.injector
          .get(LabProcessService)
          .getProcessLogs('PROTOCOL', this.scenario.protocol.id, fromDatePage),
      downloadUrl: this.injector
        .get(LabProcessService)
        .getDownloadProcessLogUrl('PROTOCOL', this.scenario.protocol.id),
    };

    this.injector
      .get(FlDialogService)
      .openBigDialog(LabLogsBetweenDatesDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private openProcessMonitor(): void {
    const input: LabMonitorBetweenDatesDialogInput = {
      title: this.scenario.title,
      monitor$: this.injector.get(LabProcessService).getProcessMonitor('PROTOCOL', this.scenario.protocol.id),
    };

    this.injector
      .get(FlDialogService)
      .openBigDialog(LabMonitorBetweenDatesDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private removeScenarioFromQueue(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.remove_scenario_from_queue',
      content: 'biox.remove_scenario_from_queue_confirmation',
      observable: this.injector.get(LabQueueService).removeScenarioFromQueue(this.scenario.id),
      successMessage: 'biox.scenario_removed_from_queue',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onConfirmUpdateClosed(result));
  }

  private deleteScenario(): void {
    const scenario = this.injector.get(LabScenarioDetailPageState).currentScenario;

    const text = this.injector.get(FlTranslateService).translate('biox.delete_scenario_confirmation');
    let content = `</p>${text}</p>`;
    if (scenario.isSynced) {
      const text = this.injector.get(FlTranslateService).translate('biox.delete_scenario_sync_confirmation');
      content += `<p>${text}</p>`;
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
      checkImpact: () => this.injector.get(LabScenarioService).checkImpactForResetScenario(scenario.id),
      callAction: () => this.injector.get(LabScenarioService).deleteScenario(scenario.id),
    };

    this.injector
      .get(LabNavigableEntityService)
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onDeleteSuccess(result));
  }

  private onDeleteSuccess(result: FlPortalActionResult<void>): void {
    if (result.status === 'success') {
      this.injector.get(FlSnackBarService).openSuccessMessage({
        text: 'biox.scenario_deleted',
        translateText: true,
      });
      this.injector.get(LabRouterService).navigateToScenarioListRoute();
    }
  }




  private deleteIntermediateResources(): void {
    const scenario = this.injector.get(LabScenarioDetailPageState).currentScenario;

    const input: FlConfirmDialogInput = {
      title: 'biox.delete_scenario_intermediate_resources',
      content: 'biox.delete_scenario_intermediate_resources_confirmation',
      observable: this.injector.get(LabScenarioService).deleteIntermediateResources(scenario.id),
      successMessage: 'biox.scenario_intermediate_resources_deleted',
    };

    this.injector.get(FlDialogService).openConfirmDialog(input);
  }
}
