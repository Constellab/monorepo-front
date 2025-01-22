import { Component } from '@angular/core';
import { LabNoteTemplateSearchComponent } from '../../../lab-core/entity-module/lab-note-template-core/component/lab-note-template-search/lab-note-template-search.component';

@Component({
  selector: 'lab-note-templates-page',
  templateUrl: './lab-note-templates-search-page.component.html',
  styleUrl: './lab-note-templates-search-page.component.scss',
  imports: [LabNoteTemplateSearchComponent],
})
export class LabNoteTemplatesSearchPageComponent {}
