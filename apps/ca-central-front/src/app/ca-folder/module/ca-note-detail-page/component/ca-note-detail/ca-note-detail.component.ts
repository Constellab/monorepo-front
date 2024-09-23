import { Component, Input } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaExperiment } from '../../../../../ca-core/model/entities/folder/ca-experiment.class';
import { CaExperimentService } from '../../../../../ca-core/service-api/ca-experiment.service';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs
} from '@monorepo/front-core-lib';
import {
  CaExperimentsListDialogInput,
  CaExperimentsTableDialogComponent
} from '../../../ca-experiment-core/component/ca-experiments-table-dialog/ca-experiments-table-dialog.component';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

@Component({
  selector: 'ca-note-detail',
  templateUrl: './ca-note-detail.component.html',
  styleUrls: ['./ca-note-detail.component.scss']
})
export class CaNoteDetailComponent {

  @Input({ required: true }) note: CaNote;

  experiments: FlArrayObs<CaExperiment>;

  constructor(private experimentService: CaExperimentService,
              private dialogService: FlDialogService,
              private noteService: CaNoteService,
              private state: CaHierarchyObjectDetailState) {
  }

  printNote(): void {
    if (window) {
      window.print();
    }
  }

  openExperimentsListDialog(): void {
    this.experiments = new FlEntityArrayObs(this.experimentService.getExperimentsByNote(this.note.id));

    const input: CaExperimentsListDialogInput = {
      experiments: this.experiments,
      title: { text: 'note_associated_experiments', translateText: true }
    };

    this.dialogService.openMediumDialog(CaExperimentsTableDialogComponent, { data: input });
  }

  deleteNote(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_note',
      content: 'delete_note_confirmation',
      translateTitleAndContent: true,
      observable: this.noteService.deleteNote(this.note.id),
      successMessage: 'note_deleted',
      translateMessage: true
    };

    this.dialogService.openConfirmDialog(input).afterClosed()
      .subscribe(result => this.onNoteDeleted(result));
  }

  private async onNoteDeleted(result: FlConfirmDialogResult): Promise<void> {
    if (result.choice) {
      this.state.navigateToParentFolder();
    }
  }
}
