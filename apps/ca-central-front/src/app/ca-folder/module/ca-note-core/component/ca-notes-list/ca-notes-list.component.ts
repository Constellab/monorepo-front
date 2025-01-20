import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { FlArrayObs } from '@monorepo/front-core-lib';

@Component({
    selector: 'ca-notes-list',
    templateUrl: './ca-notes-list.component.html',
    styleUrls: ['./ca-notes-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
