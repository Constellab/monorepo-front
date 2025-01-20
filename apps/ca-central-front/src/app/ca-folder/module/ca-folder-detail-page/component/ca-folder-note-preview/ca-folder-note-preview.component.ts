import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaNoteTextEditorConfig } from '../../../ca-note-core/model/ca-note-text-editor-config.class';

/**
 * Component in the folder page right panel to show the preview of the note
 */
@Component({
    selector: 'ca-folder-note-preview',
    templateUrl: './ca-folder-note-preview.component.html',
    styleUrls: ['./ca-folder-note-preview.component.scss'],
    standalone: false
})
export class CaFolderNotePreviewComponent implements OnInit {
  @Input() noteId: string;

  note$: Observable<CaNote>;

  textEditorConfig: CaNoteTextEditorConfig;

  constructor(private noteService: CaNoteService) {}

  ngOnInit(): void {
    this.note$ = this.noteService.getById(this.noteId);
    this.textEditorConfig = new CaNoteTextEditorConfig(this.noteService, this.noteId);
  }
}
