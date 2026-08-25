import { ChangeDetectionStrategy, Component, inject, Injector, input, output } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { FlDialogService } from '@monorepo/front-core-lib/fl-dialog';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { FlTagModule } from '@monorepo/front-core-lib/fl-tag';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, switchMap } from 'rxjs';

import { CaHierarchyObjectIconComponent } from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { CaRootFolderUserRoleObj } from '../../../../../ca-core/model/entities/folder/ca-folder-user.class';
import { CaHierarchyObjectTagDatasource } from '../../../../../ca-core/model/entities/folder/ca-hierarchy-object.class';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaDetailCardComponent } from '../../../ca-folder-hierarchy-core/component/ca-detail-card/ca-detail-card.component';
import { CaSyncObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-sync-object-info/ca-sync-object-info.component';
import { CaValidatedObjectInfoComponent } from '../../../ca-folder-hierarchy-core/component/ca-validated-object-info/ca-validated-object-info.component';
import { CaHierarchyObjectEventState } from '../../../ca-folder-hierarchy-core/state/ca-hierarchy-object-event.state';
import { CaNoteActionEvent, CaNoteDetailActionMenu } from '../../../ca-note-core/ca-note-action-menu';
import { CaNoteContentComponent } from '../../../ca-note-core/component/ca-note-content/ca-note-content.component';
import { CaNoteInfoDialogComponent } from '../../../ca-note-core/component/ca-note-info-dialog/ca-note-info-dialog.component';
import { CaNoteTextEditorConfig } from '../../../ca-note-core/model/ca-note-text-editor-config.class';

@Component({
  selector: 'ca-note-detail',
  templateUrl: './ca-note-detail.component.html',
  styleUrls: ['./ca-note-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CaDetailCardComponent,
    CaHierarchyObjectIconComponent,
    MatButton,
    MatIcon,
    MatIconButton,
    CaValidatedObjectInfoComponent,
    CaSyncObjectInfoComponent,
    FlUserModule,
    CaNoteContentComponent,
    TranslatePipe,
    FlTagModule,
    FlSectionModule,
  ],
})
export class CaNoteDetailComponent {
  noteId = input.required<string>();
  // null while the user role (from an async pipe) hasn't emitted its first value yet
  userRole = input.required<CaRootFolderUserRoleObj | null>();
  hierarchyObjectToken = input<string>();

  tags = input<CaHierarchyObjectTagDatasource>();

  noteAction = output<CaNoteActionEvent>();

  private dialogService = inject(FlDialogService);
  private noteService = inject(CaNoteService);
  private injector = inject(Injector);
  private eventState = inject(CaHierarchyObjectEventState, { optional: true });

  note$: Observable<CaNote> = toObservable(this.noteId).pipe(
    switchMap((noteId) => this.noteService.getById(noteId))
  );

  printNote(): void {
    if (window) {
      window.print();
    }
  }

  async openActionMenu(note: CaNote, event: MouseEvent): Promise<void> {
    const userRole = this.userRole();
    if (!userRole) return;

    const textEditorConfig = new CaNoteTextEditorConfig(this.noteService, note.id);

    const noteActionMenu = new CaNoteDetailActionMenu(this.injector, note.id, userRole, textEditorConfig, {
      tags: this.tags(),
    });

    noteActionMenu.openDetailActionMenu(event).subscribe((action) => this.onNoteAction(action));
  }

  private onNoteAction(event: CaNoteActionEvent): void {
    if (this.eventState) {
      this.eventState.emitHierarchyObjectEvent(event);
    }
  }

  openNoteInformation(note: CaNote): void {
    this.dialogService.openSmallDialog(CaNoteInfoDialogComponent, {
      data: note,
    });
  }
}
