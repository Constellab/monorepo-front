import { ChangeDetectionStrategy,Component } from '@angular/core';
import { LiNoteTemplateSearchComponent } from '@monorepo/lab-lib/li-note-template';

@Component({
  selector: 'lab-note-templates-page',
  templateUrl: './lab-note-templates-search-page.component.html',
  styleUrl: './lab-note-templates-search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LiNoteTemplateSearchComponent],
})
export class LabNoteTemplatesSearchPageComponent {}
