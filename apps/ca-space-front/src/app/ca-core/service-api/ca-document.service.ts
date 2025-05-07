import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { Observable } from 'rxjs';
import { CaHierarchyObject } from '../model/entities/folder/ca-hierarchy-object.class';
import { CaDocument, CaDocumentPreviewDTO } from '../model/entities/folder/ca-document.class';

@Injectable({
  providedIn: 'root',
})
export class CaDocumentService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'documents';

  public uploadDocument(file: File, folderId: string): Observable<CaHierarchyObject> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/folder/${folderId}`, formData, CaHierarchyObject);
  }

  public uploadFolder(files: File[], folderId: string): Observable<void> {
    const formData: FormData = new FormData();
    files.forEach((file) => formData.append('files', file));

    return this.apiService.post(`${this.route}/folder/${folderId}`, formData);
  }

  public getDocumentPreviewUrl(documentId: string, documentName: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${documentId}/preview/${documentName}`);
  }

  public getDocumentDownloadUrl(documentId: string, documentName: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${documentId}/download/${documentName}`);
  }

  public renameDocument(documentId: string, name: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/${documentId}/rename`, { name: name }, CaDocument);
  }

  public generateDocumentPreview(documentId: string): Observable<CaDocumentPreviewDTO> {
    return this.apiService.post(`${this.route}/${documentId}/preview-token`, null, CaDocumentPreviewDTO);
  }
}
