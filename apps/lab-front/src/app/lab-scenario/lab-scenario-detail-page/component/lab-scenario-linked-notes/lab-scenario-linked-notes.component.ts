import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { LiNote, LiNoteService } from '@monorepo/lab-lib/li-core';
import { LiNoteTableComponent, LiSelectNoteDialogComponent } from '@monorepo/lab-lib/li-note';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Component inside the scenario detail to list the notes linked with the scenario
 */
@Component({
  selector: 'lab-scenario-linked-notes',
  templateUrl: './lab-scenario-linked-notes.component.html',
  styleUrls: ['./lab-scenario-linked-notes.component.scss'],
  imports: [FlSectionModule, MatIconButton, MatTooltip, MatIcon, LiNoteTableComponent, TranslatePipe],
})
export class LabScenarioLinkedNotesComponent implements OnInit, OnDestroy {
  private noteService = inject(LiNoteService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  @Input() scenarioId: string;

  notes: FlEntityArrayObs<LiNote>;

  columns: FlTableColumnStatic<LiNote>[] = ['title', 'unlink'];

  private readonly actionName: string = 'scenario-link-note';

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.actionService
      .getResult$(this.actionName)
      .subscribe((result) => this.onAddAction(result));

    this.notes = new FlEntityArrayObs(this.noteService.getByScenario(this.scenarioId), false);
  }

  private onAddAction(result: FlPortalActionResult<LiNote>): void {
    if (result.status === 'success') {
      this.notes.addItem(result.result);
    }
  }

  linkScenario(): void {
    this.dialogService
      .openBigDialog(LiSelectNoteDialogComponent)
      .afterClosed()
      .subscribe((note) => this.selectNoteClosed(note));
  }

  private selectNoteClosed(note?: LiNote): void {
    if (note) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.noteService.addScenario(note.id, this.scenarioId).pipe(
          map(() => note) // map the note to get it after the action
        ),
        text: { text: 'biox.scenario_link_note', translateText: true },
        autoClose: true,
      });
    }
  }

  unlinkNote(note: LiNote): void {
    this.noteService
      .removeScenarioWithConfirmation(note.id, this.scenarioId)
      .subscribe((result) => this.unlinkClosed(result, note));
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, note: LiNote): void {
    if (result.choice) {
      this.notes.removeItem(note);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.notes?.manualDisconnect();
  }
}
