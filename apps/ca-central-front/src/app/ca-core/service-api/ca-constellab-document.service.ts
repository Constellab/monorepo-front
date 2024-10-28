import {
  TeRichTextContent,
  TeTextEditorHistoryBlockModification,
  TeTextEditorHistoryService
} from '@monorepo/text-editor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaDocument } from '../model/entities/folder/ca-document.class';
import { FlApiService } from '@monorepo/front-core-lib';

@Injectable({
  providedIn: 'root'
})
export class CaConstellabDocumentService implements TeTextEditorHistoryService {

  private readonly route: string = 'folders/constellab-document';

  constructor(private apiService: FlApiService) {}

  ////////////////////////////////////////// HISTORY //////////////////////////////////////////

  getHistory(documentId: string): Observable<TeTextEditorHistoryBlockModification[]> {
    return this.apiService.get(`${this.route}/history/${documentId}/`);
  }

  getUndoContent(documentId: string, modificationId: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/history/undo-content/${documentId}/${modificationId}`);
  }

  rollbackContent(documentId: string, modificationId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/history/rollback/${documentId}/${modificationId}`, {});
  }
}
