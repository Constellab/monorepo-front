import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { LabNote } from '../../../../lab-core/model/entities/lab-note.entity';
import { FlConfirmDialogResult, FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlEntityArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlPortalActionResult, FlPortalActionsService } from '@monorepo/front-core-lib/fl-portal-actions';

import { Subscription } from 'rxjs';
import { LabNoteService } from '../../../../lab-core/entity-service/lab-note.service';
import { map } from 'rxjs/operators';
import {
  LabSelectNoteDialogComponent,
} from '../../../../lab-core/entity-module/lab-note-core/component/lab-note-note-dialog/lab-select-note-dialog.component';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIcon } from '@angular/material/icon';
import {
  LabNoteTableComponent,
} from '../../../../lab-core/entity-module/lab-note-core/component/lab-note-table/lab-note-table.component';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component inside the scenario detail to list the notes linked with the scenario
 */
@Component({
  selector: 'lab-scenario-linked-notes',
  templateUrl: './lab-scenario-linked-notes.component.html',
  styleUrls: ['./lab-scenario-linked-notes.component.scss'],
  imports: [FlSectionModule, MatIconButton, MatTooltip, MatIcon, LabNoteTableComponent, TranslatePipe],
})
export class LabScenarioLinkedNotesComponent implements OnInit, OnDestroy {
  private noteService = inject(LabNoteService);
  private dialogService = inject(FlDialogService);
  private actionService = inject(FlPortalActionsService);

  @Input() scenarioId: string;

  notes: FlEntityArrayObs<LabNote>;

  columns: FlTableColumnStatic<LabNote>[] = ['title', 'unlink'];

  private readonly actionName: string = 'scenario-link-note';

  private subscription: Subscription;

  ngOnInit(): void {
    this.subscription = this.actionService
      .getResult$(this.actionName)
      .subscribe((result) => this.onAddAction(result));

    this.notes = new FlEntityArrayObs(this.noteService.getByScenario(this.scenarioId), false);
  }

  private onAddAction(result: FlPortalActionResult<LabNote>): void {
    if (result.status === 'success') {
      this.notes.addItem(result.result);
    }
  }

  linkScenario(): void {
    this.dialogService
      .openBigDialog(LabSelectNoteDialogComponent)
      .afterClosed()
      .subscribe((note) => this.selectNoteClosed(note));
  }

  private selectNoteClosed(note?: LabNote): void {
    if (note) {
      this.actionService.addAction(
        {
          type: this.actionName,
          action: this.noteService.addScenario(note.id, this.scenarioId).pipe(
            map(() => note) // map the note to get it after the action
          ),
          text: { text: 'biox.scenario_link_note', translateText: true },
        },
        true
      );
    }
  }

  unlinkNote(note: LabNote): void {
    this.noteService
      .removeScenarioWithConfirmation(note.id, this.scenarioId)
      .subscribe((result) => this.unlinkClosed(result, note));
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, note: LabNote): void {
    if (result.choice) {
      this.notes.removeItem(note);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.notes?.manualDisconnect();
  }
}
