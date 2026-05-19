import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlArrayObs, FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiNoteService, LiScenario } from '@monorepo/lab-lib/li-core';
import { LiScenarioTableComponent, LiSelectScenarioDialogComponent } from '@monorepo/lab-lib/li-scenario';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';

/**
 * Component to list the linked scenario of a note with
 * the possibility to delete or add a new
 */
@Component({
  selector: 'lab-note-linked-scenarios',
  templateUrl: './lab-note-linked-scenarios.component.html',
  styleUrls: ['./lab-note-linked-scenarios.component.scss'],
  imports: [FlSectionModule, MatIconButton, MatIcon, MatTooltip, LiScenarioTableComponent, TranslatePipe],
})
export class LabNoteLinkedScenariosComponent implements OnInit, OnDestroy {
  private state = inject(LabNoteDetailPageState);
  private noteService = inject(LiNoteService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  scenarios: FlArrayObs<LiScenario>;

  canEdit: boolean = false;

  columns: FlTableColumnStatic<LiScenario>[];

  private readonly actionName: string = 'note-link-scenario';

  private subscription: Subscription;

  ngOnInit(): void {
    // refresh the can edit bool
    this.state.getNote$().subscribe((note) => {
      this.canEdit = !note.isValidated;
      this.columns = this.canEdit ? ['title', 'unlinked'] : ['title'];
    });

    this.scenarios = new FlEntityArrayObs(
      this.noteService.getScenarioByNotes(this.state.currentNote.id),
      true
    );

    this.subscription = this.actionService
      .getResult$(this.actionName)
      .subscribe((result) => this.onAddAction(result));
  }

  private onAddAction(result: FlPortalActionResult<LiScenario>): void {
    if (result.status === 'success') {
      this.scenarios.addItem(result.result);
    }
  }

  linkScenario(): void {
    this.dialogService
      .openBigDialog(LiSelectScenarioDialogComponent)
      .afterClosed()
      .subscribe((scenario) => this.selectScenarioClosed(scenario));
  }

  private selectScenarioClosed(scenario?: LiScenario): void {
    if (scenario) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.noteService.addScenario(this.state.currentNote.id, scenario.id),
        text: { text: 'biox.note_link_scenario', translateText: true },
        autoClose: true,
      });
    }
  }

  unlinkScenario(scenario: LiScenario): void {
    this.noteService
      .removeScenarioWithConfirmation(this.state.currentNote.id, scenario.id)
      .subscribe((result) => this.unlinkClosed(result, scenario));
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, scenario: LiScenario): void {
    if (result.choice) {
      this.scenarios.removeItem(scenario);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.scenarios?.manualDisconnect();
  }
}
