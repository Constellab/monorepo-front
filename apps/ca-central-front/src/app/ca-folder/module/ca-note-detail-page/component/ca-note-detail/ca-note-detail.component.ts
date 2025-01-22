import { Component, Input, OnInit, inject } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaScenario } from '../../../../../ca-core/model/entities/folder/ca-scenario.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import {
  FlArrayObs,
  FlConfirmDialogInput,
  FlConfirmDialogResult,
  FlDialogService,
  FlEntityArrayObs,
  FlOverlayRef,
  FlPortalService,
} from '@monorepo/front-core-lib';
import {
  CaScenariosListDialogInput,
  CaScenarioTableDialogComponent,
} from '../../../ca-scenario-core/component/ca-scenario-table-dialog/ca-scenario-table-dialog.component';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { TeTextEditorHistoryPortalComponent, TeTextEditorHistoryPortalData } from '@monorepo/text-editor';
import { CaNoteTextEditorConfig } from '../../../ca-note-core/model/ca-note-text-editor-config.class';
import { CaNoteHistoryService } from '../../../../../ca-core/service/ca-note-history.service';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { MatMenuTrigger, MatMenu, MatMenuItem } from '@angular/material/menu';
import { CaIsAdminDirective } from '../../../../../ca-core/module/ca-core-directive/ca-is-admin/ca-is-admin.directive';
import { CaValidatedObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-validated-object-info/ca-validated-object-info.component';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';
import { CaNoteContentComponent } from '../../../ca-note-core/component/ca-note-content/ca-note-content.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-note-detail',
  templateUrl: './ca-note-detail.component.html',
  styleUrls: ['./ca-note-detail.component.scss'],
  imports: [
    FlCardModule,
    CaHierarchyObjectIconComponent,
    MatButton,
    MatIcon,
    FlIconModule,
    MatIconButton,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
    CaIsAdminDirective,
    CaValidatedObjectInfoComponent,
    CaSyncObjectInfoComponent,
    FlUserModule,
    CaNoteContentComponent,
    TranslatePipe,
  ],
})
export class CaNoteDetailComponent implements OnInit {
  private scenarioService = inject(CaScenarioService);
  private dialogService = inject(FlDialogService);
  private noteService = inject(CaNoteService);
  private noteHistoryService = inject(CaNoteHistoryService);
  private state = inject(CaHierarchyObjectDetailState);
  private portalService = inject(FlPortalService);

  @Input({ required: true }) note: CaNote;

  scenarios: FlArrayObs<CaScenario>;

  private historyOverlayRef: FlOverlayRef;

  textEditorConfig: CaNoteTextEditorConfig;

  ngOnInit(): void {
    this.textEditorConfig = new CaNoteTextEditorConfig(this.noteService, this.note.id);
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

    this.dialogService
      .openConfirmDialog(input)
      .afterClosed()
      .subscribe((result) => this.onNoteDeleted(result));
  }

  private async onNoteDeleted(result: FlConfirmDialogResult): Promise<void> {
    if (result.choice) {
      this.state.navigateToParentFolder();
    }
  }
}
