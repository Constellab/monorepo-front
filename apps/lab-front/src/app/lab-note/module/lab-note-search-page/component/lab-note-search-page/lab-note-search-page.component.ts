import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiNoteSearchComponent } from '@monorepo/lab-lib/li-note';

@Component({
  selector: 'lab-note-search-page',
  templateUrl: './lab-note-search-page.component.html',
  styleUrls: ['./lab-note-search-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiNoteSearchComponent],
})
export class LabNoteSearchPageComponent {}
