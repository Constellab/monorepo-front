import { Component, inject, Injector, Input, OnInit } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaScenarioService } from '../../../../../ca-core/service-api/ca-scenario.service';
import { FlEntityArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';

import {
  CaScenariosListDialogInput,
  CaScenarioTableDialogComponent,
} from '../../../ca-scenario-core/component/ca-scenario-table-dialog/ca-scenario-table-dialog.component';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaHierarchyObjectDetailState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-detail.state';
import { CaNoteTextEditorConfig } from '../../../ca-note-core/model/ca-note-text-editor-config.class';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { CaValidatedObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-validated-object-info/ca-validated-object-info.component';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { CaNoteContentComponent } from '../../../ca-note-core/component/ca-note-content/ca-note-content.component';
import { TranslatePipe } from '@ngx-translate/core';
import { CaNoteActionEvent, CaNoteDetailActionMenu } from '../../../ca-note-core/ca-note-action-menu';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';

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
    CaValidatedObjectInfoComponent,
    CaSyncObjectInfoComponent,
    FlUserModule,
    CaNoteContentComponent,
    TranslatePipe,
    FlTagModule,
  ],
})
export class CaNoteDetailComponent implements OnInit {
  private scenarioService = inject(CaScenarioService);
  private dialogService = inject(FlDialogService);
  private noteService = inject(CaNoteService);
  private state = inject(CaHierarchyObjectDetailState);
  private injector = inject(Injector);

  @Input({ required: true }) note: CaNote;

  tags = this.state.getTags();

  ngOnInit(): void {}

  printNote(): void {
    if (window) {
      window.print();
    }
  }

  openScenariosListDialog(): void {
    const scenarios = new FlEntityArrayObs(this.scenarioService.getScenariosByNote(this.note.id));

    const input: CaScenariosListDialogInput = {
      scenarios: scenarios,
      title: { text: 'note_associated_scenarios', translateText: true },
    };

    this.dialogService.openMediumDialog(CaScenarioTableDialogComponent, {
      data: input,
    });
  }

  openActionMenu(note: CaNote, event: MouseEvent): void {
    const textEditorConfig = new CaNoteTextEditorConfig(this.noteService, this.note.id);

    const noteActionMenu = new CaNoteDetailActionMenu(this.injector, note.id, textEditorConfig, {
      tags: this.tags,
    });

    noteActionMenu.openDetailActionMenu(event).subscribe((action) => this.onNoteAction(action));
  }

  private onNoteAction(event: CaNoteActionEvent): void {
    if (event.action === 'delete') {
      this.state.navigateToParentFolder();
    }
  }
}
