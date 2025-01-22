import { Injectable, inject } from '@angular/core';
import {
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { CaNoteService } from '../service-api/ca-note.service';

@Injectable({
  providedIn: 'root',
})
export class CaNoteHistoryService implements TeTextEditorHistoryService {
  private noteService = inject(CaNoteService);

  getHistory(documentId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.noteService.getNoteHistory(documentId);
  }

  getPreviousVersion(documentId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.noteService.getNotePreviousVersion(documentId, modificationId);
  }
}
