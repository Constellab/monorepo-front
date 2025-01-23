import { Component, inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CaNote } from '../../../../../ca-core/model/entities/folder/ca-note.class';
import { CaNoteService } from '../../../../../ca-core/service-api/ca-note.service';
import { CaNoteTextEditorConfig } from '../../../ca-note-core/model/ca-note-text-editor-config.class';
import {
  CaHierarchyObjectIconComponent,
} from '../../../../../ca-core/entity-module/ca-hierarchy-object-core/component/ca-hierarchy-object-icon/ca-hierarchy-object-icon.component';
import { MatAnchor } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import {
  CaNoteContentComponent,
} from '../../../ca-note-core/component/ca-note-content/ca-note-content.component';
import { AsyncPipe } from '@angular/common';
import {
  CaDetailRoutePipe,
} from '../../../../../ca-core/module/ca-core-pipe/ca-detail-route/ca-detail-route.pipe';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component in the folder page right panel to show the preview of the note
 */
@Component({
  selector: 'ca-folder-note-preview',
  templateUrl: './ca-folder-note-preview.component.html',
  styleUrls: ['./ca-folder-note-preview.component.scss'],
  imports: [
    CaHierarchyObjectIconComponent,
    MatAnchor,
    RouterLink,
    CaNoteContentComponent,
    AsyncPipe,
    CaDetailRoutePipe,
    TranslatePipe,
  ],
})
export class CaFolderNotePreviewComponent implements OnInit {
  private noteService = inject(CaNoteService);

  @Input() noteId: string;

  note$: Observable<CaNote>;

  textEditorConfig: CaNoteTextEditorConfig;

  ngOnInit(): void {
    this.note$ = this.noteService.getById(this.noteId);
    this.textEditorConfig = new CaNoteTextEditorConfig(this.noteService, this.noteId);
  }
}
