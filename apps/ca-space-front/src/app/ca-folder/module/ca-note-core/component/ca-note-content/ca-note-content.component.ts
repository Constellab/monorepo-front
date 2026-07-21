import { ChangeDetectionStrategy,Component, inject, input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlSectionModule } from '@monorepo/front-core-lib/fl-section';
import { TeRichText, TeTextEditorModule } from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaNoteTextEditorConfig } from '../../model/ca-note-text-editor-config.class';

/**
 * Component to show the note content in a disabled text editor
 */
@Component({
  selector: 'ca-note-content',
  templateUrl: './ca-note-content.component.html',
  styleUrls: ['./ca-note-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [FlSectionModule, TeTextEditorModule, ReactiveFormsModule, FormsModule],
})
export class CaNoteContentComponent implements OnInit {
  noteId = input.required<string>();
  hierarchyObjectToken = input<string>();

  private noteService = inject(CaNoteService);

  textEditorConfig: CaNoteTextEditorConfig;

  richText$: Observable<TeRichText>;

  ngOnInit(): void {
    this.richText$ = this.noteService
      .getContent(this.noteId())
      .pipe(map((content) => new TeRichText(content)));
    this.textEditorConfig = new CaNoteTextEditorConfig(
      this.noteService,
      this.noteId(),
      this.hierarchyObjectToken()
    );
  }
}
