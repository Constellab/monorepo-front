import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';

@Component({
  selector: 'ca-note-table',
  templateUrl: './ca-note-table.component.html',
  styleUrls: ['./ca-note-table.component.scss'],
})
export class CaNoteTableComponent {
  @Input({ required: true }) datasource: FlDatasource<CaNote>;

  @Input() columns: FlTableColumnStatic<CaNote>[] = ['title', 'createdBy', 'lastSync'];

  // when true, the row become clickable and resourceSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Output() noteSelected: EventEmitter<CaNote> = new EventEmitter();

  rowClicked(note: CaNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }
}
