import { inject, Injectable } from '@angular/core';
import {
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import { CaDocument } from '../model/entities/folder/ca-document.class';
import { CaConstellabDocumentService } from '../service-api/ca-constellab-document.service';

@Injectable({
  providedIn: 'root',
})
export class CaConstellabDocumentHistoryService implements TeTextEditorHistoryService {
  private constellabDocumentService = inject(CaConstellabDocumentService);

  getHistory(documentId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.constellabDocumentService.getConstellabDocumentHistory(documentId);
  }

  getPreviousVersion(documentId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.constellabDocumentService.getConstellabDocumentUndoContent(documentId, modificationId);
  }

  rollbackContent(documentId: string, modificationId: string): Observable<CaDocument> {
    return this.constellabDocumentService.rollbackConstellabDocumentContent(documentId, modificationId);
  }
}
