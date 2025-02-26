import { Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { ClHelpService } from '@monorepo/core-lib';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatSortHeader } from '@angular/material/sort';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { RouterLink } from '@angular/router';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { MatTooltip } from '@angular/material/tooltip';
import { LabTagListComponent } from '../../../lab-tag-core/component/lab-tag-list/lab-tag-list.component';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { MatIconButton } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { LabDetailRoutePipe } from '../../../../lab-core-pipe/lab-detail-route/lab-detail-route.pipe';
import { LabGetEntityTagsPipe } from '../../../lab-tag-core/pipe/lab-get-entity-tags.pipe';
import { LabTagService } from '../../../../entity-service/lab-tag.service';
import { LabNoteActionEvent, LabNoteActionMenu } from '../../model/lab-note-action-menu.class';

@Component({
  selector: 'lab-note-table',
  templateUrl: './lab-note-table.component.html',
  styleUrls: ['./lab-note-table.component.scss'],
  imports: [
    MatTable,
    FlSearchModule,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    MatTooltip,
    LabTagListComponent,
    FlUserModule,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlColorModule,
    LabDetailRoutePipe,
    LabGetEntityTagsPipe,
  ],
})
export class LabNoteTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LabNote>;

  @Input() columns: FlTableColumnStatic<LabNote>[] = ['title', 'tags', 'creation', 'lastModification'];

  // when true, the row become clickable and noteSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() noteSelected: EventEmitter<LabNote> = new EventEmitter();

  @Output() noteUnlink: EventEmitter<LabNote> = new EventEmitter();

  private injector = inject(Injector);
  private tagService = inject(LabTagService);

  rowClicked(note: LabNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }

  unlinkNote(note: LabNote, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.noteUnlink.next(note);
  }

  openActionMenu(note: LabNote, event: MouseEvent): void {
    const actionMenu = new LabNoteActionMenu(
      this.injector,
      note,
      this.tagService.getEntityTagsDatasource('NOTE', note.id)
    );

    actionMenu.openActionMenuInTable(event).subscribe((noteAction) => this.onAction(noteAction));
  }

  private onAction(noteAction: LabNoteActionEvent): void {
    this.datasource.updateItem(noteAction.note);
  }
}
