import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import { FlTranslateService } from '@monorepo/front-core-lib/fl-translate';
import {
  LiFolder,
  LiProcessService,
  LiProtocolService,
  LiQueueService,
  LiRouterService,
  LiScenario,
  LiScenarioService,
  LiTagDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiValidateObjectDialogComponent, LiValidateObjectDialogInput } from '@monorepo/lab-lib/li-entity';
import { LiLogBetweenDatesDialogInput, LiLogsBetweenDatesDialogComponent } from '@monorepo/lab-lib/li-log';
import {
  LiMonitorBetweenDatesDialogComponent,
  LiMonitorBetweenDatesDialogInput,
} from '@monorepo/lab-lib/li-monitor';
import { LiNavigableEntityService, LiNavigableImpactConfig } from '@monorepo/lab-lib/li-navigable-entity';
import { LiProcessRunInfoData, LiProgressBarInfoDialogComponent } from '@monorepo/lab-lib/li-progress-bar';
import { LiScenarioActionEvent, LiScenarioActionMenu } from '@monorepo/lab-lib/li-scenario';
import {
  LiScenarioTemplateFormDialogComponent,
  LiScenarioTemplateFormDialogInput,
} from '@monorepo/lab-lib/li-scenario-template';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { LabScenarioDetailPageState } from '../state/lab-scenario-detail-page.state';

/**
 * Action menu for a lab scenario
 */
export class LabScenarioDetailActionMenu extends LiScenarioActionMenu {
  constructor(injector: Injector, scenario: LiScenario, tags: LiTagDatasource) {
    super(injector, scenario, tags);
  }

  public openActionMenuDetail(event: MouseEvent): Observable<LiScenarioActionEvent> {
    const menu = [
      this.getTagsButton('SCENARIO', this.scenario.id, this.tags),
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
    const input: LiValidateObjectDialogInput = {
      title: 'biox.validate_scenario',
      validate: (folder: LiFolder): Observable<any> =>
        this.injector.get(LiScenarioService).validateScenario(this.scenario.id, folder.id),
      folder: this.scenario.folder,
      helpText: 'biox.validate_scenario_help_text',
      successMessage: 'biox.scenario_validated',
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiValidateObjectDialogComponent, { data: input })
      .afterClosed()
      .subscribe((result) => this.onConfirmUpdateClosed(result));
  }

  private onConfirmUpdateClosed(result: FlConfirmDialogResult<LiScenario>): void {
    if (result?.choice) {
      this.injector.get(LabScenarioDetailPageState).updateScenario(result.result);
    }
    this.subject.complete();
  }

  private openCreateScenarioTemplate(): void {
    const input: LiScenarioTemplateFormDialogInput = {
      mode: 'create',
      protocolId: this.scenario.protocol.id,
      defaultName: this.scenario.title,
      defaultDescription: this.injector.get(LabScenarioDetailPageState).currentDescription,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiScenarioTemplateFormDialogComponent, {
        data: input,
        panelClass: 'g-dialog-main-background',
      })
      .afterClosed()
      .subscribe();
  }

  private downloadScenarioTemplate(scenario: LiScenario): void {
    this.injector.get(FlPortalActionsService).addAction({
      type: 'download-scenario-template',
      action: this.injector.get(LiProtocolService).downloadScenarioTemplate(scenario.protocol.id),
      text: { text: 'biox.download_scenario_template', translateText: true },
    });
  }

  private resetScenario(): void {
    const impactData: LiNavigableImpactConfig = {
      title: { text: 'biox.reset_scenario', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.scenario_ressource_used_after',
        translateText: true,
        translateParam: {
          param: { title: this.scenario.title },
        },
      },
      noImpactConfirmText: { text: 'biox.reset_scenario_confirmation', translateText: true },
      checkImpact: () => this.injector.get(LiScenarioService).checkImpactForResetScenario(this.scenario.id),
      callAction: () => this.injector.get(LiScenarioService).resetScenario(this.scenario.id),
    };

    this.injector
      .get(LiNavigableEntityService)
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onResetSuccess(result));
  }

  private onResetSuccess(result: FlPortalActionResult<LiScenario>): void {
    if (result.status === 'success') {
      this.injector.get(LabScenarioDetailPageState).updateScenario(result.result, true);
      this.injector.get(FlSnackBarService).openSuccessMessage({
        text: 'biox.scenario_reset',
        translateText: true,
      });
    }
  }

  public openProgressInformation(): void {
    const data$: Observable<LiProcessRunInfoData> = this.injector
      .get(LabScenarioDetailPageState)
      .getMainProtocol$()
      .pipe(
        map((flow) => ({
          progressBar: flow.progressBar,
          runBy: flow.runBy,
        }))
      );

    this.injector
      .get(FlDialogService)
      .openBigDialog(LiProgressBarInfoDialogComponent, {
        data: data$,
      })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private openProcessLogs(): void {
    const input: LiLogBetweenDatesDialogInput = {
      title: this.scenario.title,
      loadFunction: (fromDatePage?: DateTime) =>
        this.injector
          .get(LiProcessService)
          .getProcessLogs('PROTOCOL', this.scenario.protocol.id, fromDatePage),
      downloadUrl: this.injector
        .get(LiProcessService)
        .getDownloadProcessLogUrl('PROTOCOL', this.scenario.protocol.id),
    };

    this.injector
      .get(FlDialogService)
      .openBigDialog(LiLogsBetweenDatesDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private openProcessMonitor(): void {
    const input: LiMonitorBetweenDatesDialogInput = {
      title: this.scenario.title,
      monitor$: this.injector.get(LiProcessService).getProcessMonitor('PROTOCOL', this.scenario.protocol.id),
    };

    this.injector
      .get(FlDialogService)
      .openBigDialog(LiMonitorBetweenDatesDialogComponent, { data: input })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  private removeScenarioFromQueue(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.remove_scenario_from_queue',
      content: 'biox.remove_scenario_from_queue_confirmation',
      observable: this.injector.get(LiQueueService).removeScenarioFromQueue(this.scenario.id),
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

    const impactData: LiNavigableImpactConfig = {
      title: { text: 'biox.delete_scenario', translateText: true },
      confirmImpactConfirmText: {
        text: 'biox.scenario_ressource_used_after',
        translateText: true,
        translateParam: {
          param: { title: scenario.title },
        },
      },
      noImpactConfirmText: { text: content, translateText: false },
      checkImpact: () => this.injector.get(LiScenarioService).checkImpactForResetScenario(scenario.id),
      callAction: () => this.injector.get(LiScenarioService).deleteScenario(scenario.id),
    };

    this.injector
      .get(LiNavigableEntityService)
      .callImpactMethodOnAction(impactData)
      .subscribe((result) => this.onDeleteSuccess(result));
  }

  private onDeleteSuccess(result: FlPortalActionResult<void>): void {
    if (result.status === 'success') {
      this.injector.get(FlSnackBarService).openSuccessMessage({
        text: 'biox.scenario_deleted',
        translateText: true,
      });
      this.injector.get(LiRouterService).navigateToScenarioListRoute();
    }
  }

  private deleteIntermediateResources(): void {
    const scenario = this.injector.get(LabScenarioDetailPageState).currentScenario;

    const input: FlConfirmDialogInput = {
      title: 'biox.delete_scenario_intermediate_resources',
      content: 'biox.delete_scenario_intermediate_resources_confirmation',
      observable: this.injector.get(LiScenarioService).deleteIntermediateResources(scenario.id),
      successMessage: 'biox.scenario_intermediate_resources_deleted',
    };

    this.injector.get(FlDialogService).openConfirmDialog(input);
  }
}
