import { Injector } from '@angular/core';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { FlSnackBarService } from '@monorepo/front-core-lib/fl-snack-bar';
import {
  LiNote,
  LiRouterService,
  LiScenario,
  LiScenarioSentToLabResponse,
  LiScenarioService,
  LiTagDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import { LiNoteFormDialogComponent, LiNoteFormDialogInput } from '@monorepo/lab-lib/li-note';
import { LiSharedEntityInfoDialogComponent, LiSharedEntityInfoDialogInput } from '@monorepo/lab-lib/li-share';
import { Observable, tap } from 'rxjs';

export type LiScenarioActionEvent = {
  action: 'archive' | 'unarchive';
  scenario: LiScenario;
};

/**
 * Action menu for a lab scenario
 */
export class LiScenarioActionMenu extends LiEntityActionMenu {
  constructor(
    injector: Injector,
    protected scenario: LiScenario,
    protected tags: LiTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LiScenarioActionEvent> {
    const menu = [
      this.getTagsButton('SCENARIO', this.scenario.id, this.tags),
      this.getCreateNoteButton(),
      this.getShareButton(),
      this.getDuplicateButton(),
      this.getArchiveButton(),
    ];

    return this.generateMenu(menu, event);
  }

  //////////////////////////////////// BUTTONS ////////////////////////////////////

  protected getCreateNoteButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.create_note',
      icon: 'post_add',
      onClick: () => this.openCreateNote(),
    };
  }

  protected getArchiveButton(): FlMenuDynamic {
    if (this.scenario.isArchived) {
      return {
        type: 'button',
        text: 'li.unarchive_scenario',
        icon: 'unarchive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.unarchive_scenario',
            content: 'li.unarchive_scenario_confirmation',
            observable: this.injector.get(LiScenarioService).unarchiveScenario(this.scenario.id),
            successMessage: 'li.scenario_unarchived',
          }),
      };
    } else {
      return {
        type: 'button',
        text: 'li.archive_scenario',
        icon: 'archive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'li.archive_scenario',
            content: 'li.archive_scenario_confirmation',
            observable: this.injector.get(LiScenarioService).archiveScenario(this.scenario.id),
            successMessage: 'li.scenario_archived',
          }),
      };
    }
  }

  protected getDuplicateButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.clone_scenario',
      icon: 'content_copy',
      onClick: () => this.openDuplicateConfirmation(),
    };
  }

  protected getShareButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'li.share',
      icon: 'share',
      onClick: () => this.openShareDialog(),
    };
  }

  //////////////////////////////////// ACTIONS ////////////////////////////////////

  private toggleArchive(dialogInput: FlConfirmDialogInput): void {
    this.injector
      .get(FlDialogService)
      .openConfirmDialog(dialogInput)
      .afterClosed()
      .subscribe((result) => this.onArchiveClosed(result));
  }

  private onArchiveClosed(result: FlConfirmDialogResult<LiScenario>): void {
    if (result.choice) {
      if (result.result.isArchived) {
        this.subject.next({ action: 'archive', scenario: result.result });
      } else {
        this.subject.next({ action: 'unarchive', scenario: result.result });
      }
    }

    this.subject.complete();
  }

  private openCreateNote(): void {
    const input: LiNoteFormDialogInput = {
      mode: 'create',
      scenarioId: this.scenario.id,
      folder: this.scenario.folder,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LiNoteFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((note) => this.onNoteCreateClosed(note));
  }

  private onNoteCreateClosed(note?: LiNote): void {
    this.subject.complete();
    if (note) {
      this.injector.get(LiRouterService).navigateToNoteDetail(note.id);
    }
  }

  private openDuplicateConfirmation(): void {
    const input: FlConfirmDialogInput = {
      title: 'li.clone_scenario',
      content: 'li.clone_scenario_confirmation',
      observable: this.injector.get(LiScenarioService).cloneScenario(this.scenario.id),
      successMessage: 'li.scenario_cloned',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDuplicateClosed(result));
  }

  private onDuplicateClosed(result: FlConfirmDialogResult<LiScenario>): void {
    this.subject.complete();
    if (result.choice) {
      this.injector.get(LiRouterService).navigateToScenarioDetail(result.result.id);
    }
  }

  private openShareDialog(): void {
    const data: LiSharedEntityInfoDialogInput = {
      entityType: 'SCENARIO',
      entityId: this.scenario.id,
      autoSendConfig: {
        title: 'li.send_scenario_to_lab',
        helpText: 'li.send_entity_to_lab_help',
        specs$: this.injector.get(LiScenarioService).getExportToLabConfigSpecs(),
      },
      autoSend: (configValues) =>
        this.injector
          .get(LiScenarioService)
          .exportScenarioToLab(this.scenario.id, configValues)
          .pipe(tap((result) => this.onSentScenarioSuccess(result))),
    };

    this.injector
      .get(FlDialogService)
      .openMediumDialog(LiSharedEntityInfoDialogComponent, {
        data,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }

  protected onSentScenarioSuccess(result: LiScenarioSentToLabResponse): void {
    this.injector.get(FlSnackBarService).openSuccessMessage(
      {
        text: 'li.scenario_sent_to_lab',
        translateText: true,
        translateParam: { param: { url: LiRouterService.getScenarioDetailRoute(result.exportScenario.id) } },
      },
      5000
    );
  }
}
