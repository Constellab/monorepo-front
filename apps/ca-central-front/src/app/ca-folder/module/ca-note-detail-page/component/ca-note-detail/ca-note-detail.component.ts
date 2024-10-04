import { Component, Input } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs
} from '@monorepo/front-core-lib';
import {
  CaScenariosListDialogInput,
  CaScenarioTableDialogComponent
} from '../../../ca-scenario-core/component/ca-scenario-table-dialog/ca-scenario-table-dialog.component';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';

@Component({
  selector: 'ca-note-detail',
  templateUrl: './ca-note-detail.component.html',
  styleUrls: ['./ca-note-detail.component.scss']
})
export class CaNoteDetailComponent {

  @Input({ required: true }) note: CaNote;

  scenarios: FlArrayObs<CaScenario>;

  constructor(private scenarioService: CaScenarioService,
              private dialogService: FlDialogService,
              private noteService: CaNoteService,
              private state: CaHierarchyObjectDetailState) {
  }

  printNote(): void {
    if (window) {
      window.print();
    }
  }

  openScenariosListDialog(): void {
    this.scenarios = new FlEntityArrayObs(this.scenarioService.getScenariosByNote(this.note.id));

    const input: CaScenariosListDialogInput = {
      scenarios: this.scenarios,
      title: { text: 'note_associated_scenarios', translateText: true }
    };

    this.dialogService.openMediumDialog(CaScenarioTableDialogComponent, { data: input });
  }

  deleteNote(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_note',
      content: 'delete_note_confirmation',
      observable: this.noteService.deleteNote(this.note.id),
      successMessage: 'note_deleted',
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
