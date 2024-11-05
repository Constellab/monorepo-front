import { Injectable } from '@angular/core';
import {
  TeRichTextContent,
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { CaNoteService } from '../service-api/ca-note.service';

@Injectable({
  providedIn: 'root',
})
export class CaNoteHistoryService implements TeTextEditorHistoryService {
  constructor(private noteService: CaNoteService) {}

  getHistory(documentId: string): Observable<TeTextEditorHistoryBlockModification[]> {
    return this.noteService.getNoteHistory(documentId);
  }

  getPreviousVersion(documentId: string, modificationId: string): Observable<TeRichTextContent> {
    return this.noteService.getNotePreviousVersion(documentId, modificationId);
  }
}
