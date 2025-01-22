import { Component, Input } from '@angular/core';
import { LabNote } from '../../../../model/entities/lab-note.entity';
import { FlUserModule } from '../../../../../../../../../libs/front-core-lib/src/lib/module/fl-user/fl-user.module';

@Component({
  selector: 'lab-note-inline',
  templateUrl: './lab-note-inline.component.html',
  styleUrls: ['./lab-note-inline.component.scss'],
  imports: [FlUserModule],
})
export class LabNoteInlineComponent {
  @Input() note: LabNote;
}
