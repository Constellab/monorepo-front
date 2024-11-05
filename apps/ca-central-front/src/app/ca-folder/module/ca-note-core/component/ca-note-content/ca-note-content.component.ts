import { Component, input, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaNoteTextEditorConfig } from '../../model/ca-note-text-editor-config.class';
import { TeRichTextContent } from '@monorepo/text-editor';

/**
 * Component to show the note content in a disabled text editor
 */
@Component({
  selector: 'ca-note-content',
  templateUrl: './ca-note-content.component.html',
  styleUrls: ['./ca-note-content.component.scss'],
})
export class CaNoteContentComponent implements OnInit {
  @Input() noteId: string;

  textEditorConfig: CaNoteTextEditorConfig;

  content$: Observable<TeRichTextContent>;

  constructor(private noteService: CaNoteService) {}

  ngOnInit(): void {
    this.content$ = this.noteService.getContent(this.noteId);
    this.textEditorConfig = new CaNoteTextEditorConfig(this.noteService, this.noteId);
  }
}
