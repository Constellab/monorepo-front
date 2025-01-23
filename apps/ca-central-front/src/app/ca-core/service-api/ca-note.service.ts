import { Injectable, inject } from '@angular/core';
import { CaNote, CaResourceView } from '../model/entities/folder/ca-note.class';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { TeRichTextBlockModificationWithUser, TeRichTextDTO } from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root',
})
export class CaNoteService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'notes';

  getNotesByScenario(scenarioId: string): Observable<CaNote[]> {
    return this.apiService.get(`${this.route}/scenario/${scenarioId}`, CaNote);
  }

  getById(id: string): Observable<CaNote> {
    return this.apiService.getById(this.route, id, CaNote);
  }

  getContent(noteId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/${noteId}/content`);
  }

  deleteNote(noteId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${noteId}`);
  }

  ////////////////////////////// METHOD FOR TEXT EDITOR //////////////////////////

  getFileUrl(noteId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${noteId}/file/${filename}`);
  }

  getView(noteId: string, viewId: string): Observable<CaResourceView> {
    return this.apiService.get(`${this.route}/${noteId}/view/${viewId}`, CaResourceView);
  }

  ////////////////////////////////////////// HISTORY //////////////////////////////////////////

  getNoteHistory(noteId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.apiService.get(`${this.route}/${noteId}/history/`, TeRichTextBlockModificationWithUser);
  }

  getNotePreviousVersion(noteId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/${noteId}/history/undo-content/${modificationId}`);
  }
}
