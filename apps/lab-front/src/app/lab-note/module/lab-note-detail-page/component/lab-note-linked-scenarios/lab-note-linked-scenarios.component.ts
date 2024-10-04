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
  LabSelectScenarioDialogComponent
} from '../../../../../lab-core/entity-module/lab-scenario-core/component/lab-select-scenario-dialog/lab-select-scenario-dialog.component';
import { LabScenario } from '../../../../../lab-core/model/entities/lab-scenario.entity';
import { Subscription } from 'rxjs';
import { LabNoteDetailPageState } from '../../lab-note-detail-page-state.service';

/**
 * Component to list the linked scenario of a note with
 * the possibility to delete or add a new
 */
@Component({
  selector: 'lab-note-linked-scenarios',
  templateUrl: './lab-note-linked-scenarios.component.html',
  styleUrls: ['./lab-note-linked-scenarios.component.scss']
})
export class LabNoteLinkedScenariosComponent implements OnInit, OnDestroy {

  scenarios: FlArrayObs<LabScenario>;

  canEdit: boolean = false;

  columns: FlTableColumnStatic<LabScenario>[];

  private readonly actionName: string = 'note-link-scenario';

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

    this.scenarios = new FlEntityArrayObs(this.noteService.getScenarioByNotes(this.state.currentNote.id));

    this.subscription = this.actionService.getResult$(this.actionName).subscribe(
      result => this.onAddAction(result)
    );
  }

  private onAddAction(result: FlPortalActionResult<LabScenario>): void {
    if (result.status === 'success') {
      this.scenarios.addItem(result.result);
    }
  }

  linkScenario(): void {
    this.dialogService.openBigDialog(LabSelectScenarioDialogComponent).afterClosed().subscribe(
      scenario => this.selectScenarioClosed(scenario)
    );
  }

  private selectScenarioClosed(scenario?: LabScenario): void {
    if (scenario) {
      this.actionService.addAction({
        type: this.actionName,
        action: this.noteService.addScenario(this.state.currentNote.id, scenario.id),
        text: {text: 'biox.note_link_scenario', translateText: true},
      }, true);
    }
  }

  unlinkScenario(scenario: LabScenario): void {
    this.noteService.removeScenarioWithConfirmation(this.state.currentNote.id, scenario.id).subscribe(
      result => this.unlinkClosed(result, scenario)
    );
  }

  private unlinkClosed(result: FlConfirmDialogResult<void>, scenario: LabScenario): void {
    if (result.choice) {
      this.scenarios.removeItem(scenario);
    }
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }


}
