import { Injectable } from '@angular/core';
import { CaNote, CaResourceView } from '../model/entities/folder/ca-note.class';
import { FlApiService } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { TeRichTextContent } from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root'
})
export class CaNoteService {

  private readonly route: string = 'notes';

  constructor(private apiService: FlApiService) {
  }

  getNotesByExperiment(experimentId: string): Observable<CaNote[]> {
    return this.apiService.get(`${this.route}/experiment/${experimentId}`, CaNote);
  }

  getById(id: string): Observable<CaNote> {
    return this.apiService.getById(this.route, id, CaNote);
  }

  getContent(noteId: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/${noteId}/content`);
  }

  deleteNote(noteId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/${noteId}`);
  }

  ////////////////////////////// METHOD FOR TEXT EDITOR //////////////////////////

  getFileUrl(noteId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${noteId}/file/${filename}`);
  }

  getView(noteId: string, viewId: string): Observable<CaResourceView> {
    return this.apiService.get(`${this.route}/${noteId}/view/${viewId}`, CaResourceView);
  }

}
