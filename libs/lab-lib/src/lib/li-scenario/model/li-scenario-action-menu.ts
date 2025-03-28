import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { Injector } from '@angular/core';
import { LiEntityActionMenu } from '@monorepo/lab-lib/li-entity';
import {
  LiNote,
  LiRouterService,
  LiScenario,
  LiScenarioService,
  LiTagDatasource,
} from '@monorepo/lab-lib/li-core';
import { LiNoteFormDialogComponent, LiNoteFormDialogInput } from '@monorepo/lab-lib/li-note';
import { Observable } from 'rxjs';
import { LiSharedEntityInfoDialogComponent, LiSharedEntityInfoDialogInput } from '@monorepo/lab-lib/li-share';

export type LiScenarioActionEvent = {
  action: 'archive' | 'unarchive';
  scenario: LiScenario;
};

/**
 * Action menu for a lab scenario
 */
export class LiScenarioActionMenu extends LiEntityActionMenu<LiScenarioActionEvent> {
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
      text: 'biox.create_note',
      icon: 'post_add',
      onClick: () => this.openCreateNote(),
    };
  }

  protected getArchiveButton(): FlMenuDynamic {
    if (this.scenario.isArchived) {
      return {
        type: 'button',
        text: 'biox.unarchive_scenario',
        icon: 'unarchive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'biox.unarchive_scenario',
            content: 'biox.unarchive_scenario_confirmation',
            observable: this.injector.get(LiScenarioService).unarchiveScenario(this.scenario.id),
            successMessage: 'biox.scenario_unarchived',
          }),
      };
    } else {
      return {
        type: 'button',
        text: 'biox.archive_scenario',
        icon: 'archive',
        color: 'warn',
        onClick: () =>
          this.toggleArchive({
            title: 'biox.archive_scenario',
            content: 'biox.archive_scenario_confirmation',
            observable: this.injector.get(LiScenarioService).archiveScenario(this.scenario.id),
            successMessage: 'biox.scenario_archived',
          }),
      };
    }
  }

  protected getDuplicateButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.clone_scenario',
      icon: 'content_copy',
      onClick: () => this.openDuplicateConfirmation(),
    };
  }

  protected getShareButton(): FlMenuDynamic {
    return {
      type: 'button',
      text: 'biox.share',
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
      title: 'biox.clone_scenario',
      content: 'biox.clone_scenario_confirmation',
      observable: this.injector.get(LiScenarioService).cloneScenario(this.scenario.id),
      successMessage: 'biox.scenario_cloned',
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
        title: 'biox.send_scenario_to_lab',
        helpText: 'biox.send_entity_to_lab_help',
        specs$: this.injector.get(LiScenarioService).getExportToLabConfigSpecs(),
      },
      autoSend: (configValues) =>
        this.injector.get(LiScenarioService).exportScenarioToLab(this.scenario.id, configValues),
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
}
