import { Component } from '@angular/core';
import { LabNoteSearchComponent } from '../../../../../lab-core/entity-module/lab-note-core/component/lab-note-search/lab-note-search.component';

@Component({
  selector: 'lab-note-search-page',
  templateUrl: './lab-note-search-page.component.html',
  styleUrls: ['./lab-note-search-page.component.scss'],
  imports: [LabNoteSearchComponent],
})
export class LabNoteSearchPageComponent {}
