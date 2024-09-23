import { Component, Input } from '@angular/core';
import { LabNote } from '../../../../model/entities/lab-note.entity';

@Component({
  selector: 'lab-note-inline',
  templateUrl: './lab-note-inline.component.html',
  styleUrls: ['./lab-note-inline.component.scss'],
})
export class LabNoteInlineComponent {

  @Input() note: LabNote;
}
