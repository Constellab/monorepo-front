import { Component, Input, OnInit } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs, FlOverlayRef, FlPortalService
} from '@monorepo/front-core-lib';
import {
  CaScenariosListDialogInput,
  CaScenarioTableDialogComponent
} from '../../../ca-scenario-core/component/ca-scenario-table-dialog/ca-scenario-table-dialog.component';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { TeTextEditorHistoryPortalComponent, TeTextEditorHistoryPortalData } from '@monorepo/text-editor';
import { CaNoteTextEditorConfig } from '../../../ca-note-core/model/ca-note-text-editor-config.class';
import { CaNoteHistoryService } from '../../../../../ca-core/service/ca-note-history.service';

@Component({
  selector: 'ca-note-detail',
  templateUrl: './ca-note-detail.component.html',
  styleUrls: ['./ca-note-detail.component.scss'],
})
export class CaNoteDetailComponent implements OnInit {
  @Input({ required: true }) note: CaNote;

  scenarios: FlArrayObs<CaScenario>;

  private historyOverlayRef: FlOverlayRef;

  textEditorConfig: CaNoteTextEditorConfig;

  constructor(
    private scenarioService: CaScenarioService,
    private dialogService: FlDialogService,
    private noteService: CaNoteService,
    private noteHistoryService: CaNoteHistoryService,
    private state: CaHierarchyObjectDetailState,
    private portalService: FlPortalService
  ) {}

  ngOnInit(): void {
    this.textEditorConfig = new CaNoteTextEditorConfig(this.noteService, this.note.id);
  }

  printNote(): void {
    if (window) {
      window.print();
    }
  }

  openScenariosListDialog(): void {
    this.scenarios = new FlEntityArrayObs(
      this.scenarioService.getScenariosByNote(this.note.id)
    );

    const input: CaScenariosListDialogInput = {
      scenarios: this.scenarios,
      title: { text: 'note_associated_scenarios', translateText: true },
    };

    this.dialogService.openMediumDialog(CaScenarioTableDialogComponent, {
      data: input,
    });
  }

  toggleNoteHistoryPanel(note: CaNote): void {
    if (this.historyOverlayRef) {
      this.historyOverlayRef.dispose();
      this.historyOverlayRef = null;
    } else {
      this.historyOverlayRef = this.portalService?.createPortal(
        TeTextEditorHistoryPortalComponent,
        this.portalService?.getRightSidePortalConfig(true),
        {
          service: this.noteHistoryService,
          entityId: this.note.id,
          textEditorConfig: this.textEditorConfig,
          isEditable: false,
        } as TeTextEditorHistoryPortalData
      );
      this.historyOverlayRef.detachments().subscribe(() => {
        this.historyOverlayRef = null;
      });
    }
  }

  deleteNote(): void {
    const input: FlConfirmDialogInput = {
      title: 'delete_note',
      content: 'delete_note_confirmation',
      observable: this.noteService.deleteNote(this.note.id),
      successMessage: 'note_deleted',
    };

    this.dialogService.openConfirmDialog(input).afterClosed().subscribe((result) => this.onNoteDeleted(result));
  }

  private async onNoteDeleted(result: FlConfirmDialogResult): Promise<void> {
    if (result.choice) {
      this.state.navigateToParentFolder();
    }
  }
}
