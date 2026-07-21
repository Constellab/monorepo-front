import { ChangeDetectionStrategy,Component, EventEmitter, inject, Injector, Input, Output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSortHeader } from '@angular/material/sort';
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
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { ClHelpService } from '@monorepo/core-lib';
import { FlColorModule } from '@monorepo/front-core-lib/fl-color';
import { FlArrayObs, FlTableColumnStatic } from '@monorepo/front-core-lib/fl-core';
import { FlSearchModule } from '@monorepo/front-core-lib/fl-search';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiDetailRoutePipe, LiNote, LiTagService } from '@monorepo/lab-lib/li-core';
import { LiGetEntityTagsPipe, LiTagListComponent } from '@monorepo/lab-lib/li-tag';
import { TranslatePipe } from '@ngx-translate/core';

import { LiNoteActionEvent, LiNoteActionMenu } from '../../model/li-note-action-menu.class';

@Component({
  selector: 'li-note-table',
  templateUrl: './li-note-table.component.html',
  styleUrls: ['./li-note-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
    LiTagListComponent,
    FlUserModule,
    MatIconButton,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
    FlColorModule,
    LiDetailRoutePipe,
    LiGetEntityTagsPipe,
  ],
})
export class LiNoteTableComponent {
  @Input({ required: true }) datasource: FlArrayObs<LiNote>;

  @Input() columns: FlTableColumnStatic<LiNote>[] = ['title', 'tags', 'creation', 'lastModification'];

  // when true, the row become clickable and noteSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() noteSelected: EventEmitter<LiNote> = new EventEmitter();

  @Output() noteUnlink: EventEmitter<LiNote> = new EventEmitter();

  private injector = inject(Injector);
  private tagService = inject(LiTagService);

  rowClicked(note: LiNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }

  unlinkNote(note: LiNote, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.noteUnlink.next(note);
  }

  openActionMenu(note: LiNote, event: MouseEvent): void {
    const actionMenu = new LiNoteActionMenu(this.injector, note);

    actionMenu.openActionMenuInTable(event).subscribe((noteAction) => this.onAction(noteAction));
  }

  private onAction(noteAction: LiNoteActionEvent): void {
    this.datasource.updateItem(noteAction.note);
  }
}
