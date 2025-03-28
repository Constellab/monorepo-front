import { Component, Input } from '@angular/core';
import { FlUserModule } from '@monorepo/front-core-lib/fl-user';
import { LiNote } from '@monorepo/lab-lib/li-core';

@Component({
  selector: 'li-note-inline',
  templateUrl: './li-note-inline.component.html',
  styleUrls: ['./li-note-inline.component.scss'],
  imports: [FlUserModule],
})
export class LiNoteInlineComponent {
  @Input() note: LiNote;
}
