import {
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaDocument } from '../model/entities/folder/ca-document.class';
import { CaFolderService } from '../service-api/ca-folder.service';

@Injectable({
  providedIn: 'root',
})
export class CaConstellabDocumentHistoryService implements TeTextEditorHistoryService {
  constructor(private folderService: CaFolderService) {}

  getHistory(documentId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.folderService.getConstellabDocumentHistory(documentId);
  }

  getPreviousVersion(documentId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.folderService.getConstellabDocumentUndoContent(documentId, modificationId);
  }

  rollbackContent(documentId: string, modificationId: string): Observable<CaDocument> {
    return this.folderService.rollbackConstellabDocumentContent(documentId, modificationId);
  }
}
