import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LabNote } from '../../../../../lab-core/model/entities/lab-note.entity';
import {
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import { Subscription } from 'rxjs';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import { map } from 'rxjs/operators';
import {
  LabSelectNoteDialogComponent
} from '../../../../../lab-core/entity-module/lab-note-core/component/lab-note-note-dialog/lab-select-note-dialog.component';

/**
 * Component inside the experiment detail to list the notes linked with the experiment
 */
@Component({
  selector: 'lab-experiment-linked-notes',
  templateUrl: './lab-experiment-linked-notes.component.html',
  styleUrls: ['./lab-experiment-linked-notes.component.scss']
})
export class LabExperimentLinkedNotesComponent implements OnInit, OnDestroy {

  @Input() experimentId: string;

  notes: FlEntityArrayObs<LabNote>;

  columns: FlTableColumnStatic<LabNote>[] = ['title', 'unlink'];

  private readonly actionName: string = 'experiment-link-note';

  private subscription: Subscription;

  constructor(private noteService: LabNoteService,
              private dialogService: FlDialogService,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    this.subscription = this.actionService.getResult$(this.actionName).subscribe(
      result => this.onAddAction(result)
    );

    this.notes = new FlEntityArrayObs(this.noteService.getByExperiment(this.experimentId));
  }

  private onAddAction(result: FlPortalActionResult<LabNote>): void {
    if (result.status === 'success') {
      this.notes.addItem(result.result);
    }
  }

  linkExperiment(): void {
    this.dialogService.openBigDialog(LabSelectNoteDialogComponent).afterClosed().subscribe(
      note => this.selectNoteClosed(note)
    );
  }

  private selectNoteClosed(note?: LabNote): void {
    if (note) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.noteService.addExperiment(note.id, this.experimentId).pipe(
          map(() => note) // map the note to get it after the action
        ),
        text: {text: 'biox.experiment_link_note', translateText: true},
      }, true);
    }
  }

  unlinkNote(note: LabNote): void {
    this.noteService.removeExperimentWithConfirmation(note.id, this.experimentId).subscribe(
      result => this.unlinkClosed(result, note)
    );
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, note: LabNote): void {
    if (result.choice) {
      this.notes.removeItem(note);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
