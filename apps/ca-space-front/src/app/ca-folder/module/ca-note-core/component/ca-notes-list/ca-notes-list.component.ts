import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { FlArrayObs } from '@monorepo/front-core-lib/fl-core';
import { FlCardModule } from '@monorepo/front-core-lib/fl-card';
import { FlTextIconModule } from '@monorepo/front-core-lib/fl-text-icon';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '@monorepo/front-core-lib/fl-svg-icon';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { CaNoteTableComponent } from '../ca-note-table/ca-note-table.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'ca-notes-list',
  templateUrl: './ca-notes-list.component.html',
  styleUrls: ['./ca-notes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FlCardModule,
    FlTextIconModule,
    MatIcon,
    FlIconModule,
    FlSectionModule,
    CaNoteTableComponent,
    TranslatePipe,
  ],
})
export class CaNotesListComponent {
  @Input({ required: true }) notes: FlArrayObs<CaNote>;

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() noteSelected: EventEmitter<CaNote> = new EventEmitter();

  selectNote(note: CaNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }
}
