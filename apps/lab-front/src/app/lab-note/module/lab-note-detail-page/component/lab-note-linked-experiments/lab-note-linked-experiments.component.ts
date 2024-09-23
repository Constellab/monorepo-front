import { Component, OnDestroy, OnInit } from '@angular/core';
import { LabNoteService } from '../../../../../lab-core/entity-service/lab-note.service';
import {
  FlArrayObs,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs,
  FlPortalActionResult,
  FlPortalActionsService,
  FlTableColumnStatic
} from '@monorepo/front-core-lib';
import {
  LabSelectExperimentDialogComponent
} from '../../../../../lab-core/entity-module/lab-experiment-core/component/lab-select-experiment-dialog/lab-select-experiment-dialog.component';
import { LabExperiment } from '../../../../../lab-core/model/entities/lab-experiment.entity';
import { Subscription } from 'rxjs';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';

/**
 * Component to list the linked experiment of a note with
 * the possibility to delete or add a new
 */
@Component({
  selector: 'lab-note-linked-experiments',
  templateUrl: './lab-note-linked-experiments.component.html',
  styleUrls: ['./lab-note-linked-experiments.component.scss']
})
export class LabNoteLinkedExperimentsComponent implements OnInit, OnDestroy {

  experiments: FlArrayObs<LabExperiment>;

  canEdit: boolean = false;

  columns: FlTableColumnStatic<LabExperiment>[];

  private readonly actionName: string = 'note-link-experiment';

  private subscription: Subscription;

  constructor(private state: LabNoteDetailPageState,
              private noteService: LabNoteService,
              private dialogService: FlDialogService,
              private actionService: FlPortalActionsService) {
  }

  ngOnInit(): void {
    // refresh the can edit bool
    this.state.getNote$().subscribe(
      note => {
        this.canEdit = !note.isValidated;
        this.columns = this.canEdit ? ['title', 'unlinked'] : ['title'];
      }
    );

    this.experiments = new FlEntityArrayObs(this.noteService.getExperimentByNotes(this.state.currentNote.id));

    this.subscription = this.actionService.getResult$(this.actionName).subscribe(
      result => this.onAddAction(result)
    );
  }

  private onAddAction(result: FlPortalActionResult<LabExperiment>): void {
    if (result.status === 'success') {
      this.experiments.addItem(result.result);
    }
  }

  linkExperiment(): void {
    this.dialogService.openBigDialog(LabSelectExperimentDialogComponent).afterClosed().subscribe(
      experiment => this.selectExperimentClosed(experiment)
    );
  }

  private selectExperimentClosed(experiment?: LabExperiment): void {
    if (experiment) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.noteService.addExperiment(this.state.currentNote.id, experiment.id),
        text: {text: 'biox.note_link_experiment', translateText: true},
      }, true);
    }
  }

  unlinkExperiment(experiment: LabExperiment): void {
    this.noteService.removeExperimentWithConfirmation(this.state.currentNote.id, experiment.id).subscribe(
      result => this.unlinkClosed(result, experiment)
    );
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, experiment: LabExperiment): void {
    if (result.choice) {
      this.experiments.removeItem(experiment);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
