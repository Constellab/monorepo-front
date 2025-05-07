import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { CaConstellabDocument, CaDocument } from '../model/entities/folder/ca-document.class';
import {
  TeBlockFigureData,
  TeBlockFileUploadResponse,
  TeRichText,
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
} from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root',
})
export class CaConstellabDocumentService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'constellab-documents';

  public createConstellabDocument(
    parentFolderId: string,
    filename: string
  ): Observable<CaConstellabDocument> {
    return this.apiService.post(
      `${this.route}/folder/${parentFolderId}`,
      { name: filename },
      CaConstellabDocument
    );
  }

  public updateConstellabDocument(
    documentId: string,
    richText: TeRichText
  ): Observable<CaConstellabDocument> {
    return this.apiService.put(`${this.route}/${documentId}`, richText.toJson(), CaConstellabDocument, {
      hideSnackBarError: true,
    });
  }

  // raise an error if the document is 'locked'
  public checkEditConstellabDocument(documentId: string): Observable<boolean> {
    return this.apiService.get(`${this.route}/${documentId}/check-edit`);
  }

  public getConstellabDocument(documentId: string): Observable<CaConstellabDocument> {
    return this.apiService.get(`${this.route}/${documentId}`, CaConstellabDocument);
  }

  public uploadImageToConstellabDocument(file: File, documentId: string): Observable<TeBlockFigureData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${documentId}/image`, formData);
  }

  public uploadFileToConstellabDocument(
    file: File,
    documentId: string
  ): Observable<TeBlockFileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${documentId}/file`, formData);
  }

  public getConstellabDocumentFileUrl(documentId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${documentId}/file/${filename}`);
  }

  getConstellabDocumentHistory(documentId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.apiService.get(`${this.route}/${documentId}/history/`, TeRichTextBlockModificationWithUser);
  }

  getConstellabDocumentUndoContent(documentId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/${documentId}/history/undo-content/${modificationId}`);
  }

  rollbackConstellabDocumentContent(documentId: string, modificationId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/${documentId}/history/rollback/${modificationId}`, {});
  }
}
