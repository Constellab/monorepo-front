import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { FlArrayObs } from '@monorepo/front-core-lib';
import { FlCardModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-card/fl-card.module';
import { FlTextIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-text-icon/fl-text-icon.module';
import { MatIcon } from '@angular/material/icon';
import { FlIconModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-svg-icon/fl-icon.module';
import { FlSectionModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-section/fl-section.module';
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
