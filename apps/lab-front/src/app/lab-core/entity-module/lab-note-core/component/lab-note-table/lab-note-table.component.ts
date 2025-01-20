import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlDatasource, FlTableColumnStatic } from '@monorepo/front-core-lib';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { ClHelpService } from '@monorepo/core-lib';

@Component({
    selector: 'lab-note-table',
    templateUrl: './lab-note-table.component.html',
    styleUrls: ['./lab-note-table.component.scss'],
    standalone: false
})
export class LabNoteTableComponent {
  @Input({ required: true }) datasource: FlDatasource<LabNote>;

  @Input() columns: FlTableColumnStatic<LabNote>[] = ['title', 'tags', 'creation', 'lastModification'];

  // when true, the row become clickable and noteSelected event is trigger
  @Input() rowSelectable: boolean = false;

  @Input() rowLinkTarget: '_self' | '_blank' = '_self';

  @Output() noteSelected: EventEmitter<LabNote> = new EventEmitter();

  @Output() noteUnlink: EventEmitter<LabNote> = new EventEmitter();

  rowClicked(note: LabNote): void {
    if (this.rowSelectable) {
      this.noteSelected.next(note);
    }
  }

  unlinkNote(note: LabNote, event: MouseEvent): void {
    ClHelpService.stopEventPropagation(event);
    this.noteUnlink.next(note);
  }
}
