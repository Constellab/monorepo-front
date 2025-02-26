import { FlMenuDynamic } from '@monorepo/front-core-lib/fl-menu-dynamic';
import { LabScenario } from '../../../model/entities/lab-scenario.entity';
import {
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
} from '@monorepo/front-core-lib/fl-dialog';
import { Observable } from 'rxjs';
import { LabScenarioService } from '../../../entity-service/lab-scenario.service';
import { LabTagDatasource } from '../../../model/entities/lab-tag.entity';
import {
  LabNoteFormDialogComponent,
  LabNoteFormDialogInput,
} from '../../lab-note-core/component/lab-note-form-dialog/lab-note-form-dialog.component';
import { LabNote } from '../../../model/entities/lab-note.entity';
import { LabRouterService } from '../../../service/lab-router.service';
import {
  LabSharedEntityInfoDialogComponent,
  LabSharedEntityInfoDialogInput,
} from '../../lab-share-core/component/lab-shared-entity-info-dialog/lab-shared-entity-info-dialog.component';
import { Injector } from '@angular/core';
import { LabEntityActionMenu } from '../../lab-entity-core/lab-entity-action-menu.class';

export type LabScenarioActionEvent = {
  action: 'archive' | 'unarchive';
  scenario: LabScenario;
};

/**
 * Action menu for a lab scenario
 */
export class LabScenarioActionMenu extends LabEntityActionMenu<LabScenarioActionEvent> {
  constructor(
    injector: Injector,
    protected scenario: LabScenario,
    protected tags: LabTagDatasource
  ) {
    super(injector);
  }

  public openActionMenuInTable(event: MouseEvent): Observable<LabScenarioActionEvent> {
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
            observable: this.injector.get(LabScenarioService).unarchiveScenario(this.scenario.id),
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
            observable: this.injector.get(LabScenarioService).archiveScenario(this.scenario.id),
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

  private onArchiveClosed(result: FlConfirmDialogResult<LabScenario>): void {
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
    const input: LabNoteFormDialogInput = {
      mode: 'create',
      scenarioId: this.scenario.id,
      folder: this.scenario.folder,
    };

    this.injector
      .get(FlDialogService)
      .openSmallDialog(LabNoteFormDialogComponent, { data: input })
      .afterClosed()
      .subscribe((note) => this.onNoteCreateClosed(note));
  }

  private onNoteCreateClosed(note?: LabNote): void {
    this.subject.complete();
    if (note) {
      this.injector.get(LabRouterService).navigateToNoteDetail(note.id);
    }
  }

  private openDuplicateConfirmation(): void {
    const input: FlConfirmDialogInput = {
      title: 'biox.clone_scenario',
      content: 'biox.clone_scenario_confirmation',
      observable: this.injector.get(LabScenarioService).cloneScenario(this.scenario.id),
      successMessage: 'biox.scenario_cloned',
    };

    this.injector
      .get(FlDialogService)
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onDuplicateClosed(result));
  }

  private onDuplicateClosed(result: FlConfirmDialogResult<LabScenario>): void {
    this.subject.complete();
    if (result.choice) {
      this.injector.get(LabRouterService).navigateToScenarioDetail(result.result.id);
    }
  }

  private openShareDialog(): void {
    const data: LabSharedEntityInfoDialogInput = {
      entityType: 'SCENARIO',
      entityId: this.scenario.id,
      autoSendConfig: {
        title: 'biox.send_scenario_to_lab',
        helpText: 'biox.send_entity_to_lab_help',
        specs$: this.injector.get(LabScenarioService).getExportToLabConfigSpecs(),
      },
      autoSend: (configValues) =>
        this.injector.get(LabScenarioService).exportScenarioToLab(this.scenario.id, configValues),
    };

    this.injector
      .get(FlDialogService)
      .openMediumDialog(LabSharedEntityInfoDialogComponent, {
        data,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe(() => this.subject.complete());
  }
}
