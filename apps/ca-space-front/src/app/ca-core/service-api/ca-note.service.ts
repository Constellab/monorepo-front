import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { TeRichTextBlockModificationWithUser, TeRichTextDTO } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { CaNote, CaResourceView } from '../model/entities/folder/ca-note.class';
import { CaLabMinimumDTO } from '../model/entities/lab/ca-lab.class';

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

  getNoteLab(noteId: string): Observable<CaLabMinimumDTO> {
    return this.apiService.get(`${this.route}/${noteId}/lab`, CaLabMinimumDTO);
  }

  ////////////////////////////// METHOD FOR TEXT EDITOR //////////////////////////

  getFileUrl(noteId: string, filename: string, token?: string): string {
    let url = this.apiService.getBaseRouteUrl(`${this.route}/${noteId}/file/${filename}`);
    if (token) {
      url += `?token=${token}`;
    }
    return url;
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
