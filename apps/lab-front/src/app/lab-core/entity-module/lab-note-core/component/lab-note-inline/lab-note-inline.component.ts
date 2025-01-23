import { Component, Input } from '@angular/core';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';

@Component({
  selector: 'lab-note-inline',
  templateUrl: './lab-note-inline.component.html',
  styleUrls: ['./lab-note-inline.component.scss'],
  imports: [FlUserModule],
})
export class LabNoteInlineComponent {
  @Input() note: LabNote;
}
