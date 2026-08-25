import { inject, Injectable } from '@angular/core';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { RvResourceView } from '@monorepo/resource-view';
import {
  TeBlockFigureUploadedResponse,
  TeRichText,
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

import { HaFile } from '../entity-module/ha-file-core/model/ha-file';
import { HaFileServiceInterface } from '../entity-module/ha-file-core/model/ha-file-service.interface';
import {
  HaDocumentation,
  HaDocumentationUpdateContentResponse,
  HaDocumentationUpdateContentResponseDTO,
} from '../ha-model/ha-entities/ha-documentation.class';
import { HaNodeDTO } from '../ha-model/ha-entities/ha-node.class';

/**
 * Service to manage documentation entity
 */
@Injectable({
  providedIn: 'root',
})
export class HaDocumentationService
  implements HaFileServiceInterface<HaDocumentation>, TeTextEditorHistoryService
{
  private apiService = inject(FlApiService);

  private readonly route: string = 'documentation';

  /**
   * Call http get one by id
   * @param id id of the entity
   */
  public getById(id: string): Observable<HaDocumentation> {
    return this.apiService.getById(this.route, id, HaDocumentation);
  }

  /**
   * Call http post one by complete path
   * @param completePath complete path of the entity
   */
  public getByCompletePath(
    brickName: string,
    version: string,
    completePath: string
  ): Observable<HaDocumentation> {
    return this.apiService.post(`${this.route}/complete-path`, {
      brickName: brickName,
      version: version,
      completePath: completePath,
    });
  }

  /**
   * Call http updateContent.
   * The server sanitizes the rich text on write: it returns the saved documentation wrapped
   * with the list of what it stripped. Warnings are empty when the content was already valid.
   */
  public updateContent(id: string, content: TeRichText): Observable<HaDocumentationUpdateContentResponse> {
    return this.apiService.put(this.route + '/content/' + id, content.toJson()).pipe(
      map((response: HaDocumentationUpdateContentResponseDTO) => ({
        documentation: plainToInstance(HaDocumentation, response.documentation),
        warnings: response.warnings ?? [],
      }))
    );
  }

  /**
   * Call http update
   * @param object json object
   */
  public update(object: Partial<HaNodeDTO>): Observable<HaDocumentation> {
    return this.apiService.put(this.route, object, HaDocumentation);
  }

  /**
   * Call http delete
   * @param id id of the entity
   */
  public deleteById(id: string): Observable<HaDocumentation> {
    return this.apiService.deleteById(this.route, id, HaDocumentation);
  }

  ///////////////////////////////////////////// IMAGE /////////////////////////////////////////////

  public getFilePath(docId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${docId}/image/${filename}`);
  }

  uploadImage(file: File, docId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/image/${docId}`, formData);
  }

  getImageUrl(docId: string, filename: string): string {
    return this.getFilePath(docId, filename);
  }

  ////////////////////////////////// RESOURCE VIEW //////////////////////////////////
  uploadDocResourceViewFile(docId: string, file: FormData): Observable<any> {
    return this.apiService.post(`${this.route}/${docId}/upload-view`, file);
  }

  getView(docId: string, filename: string): Observable<RvResourceView> {
    return this.apiService.get(`${this.route}/${docId}/view/${filename}`);
  }

  getViewUrl(docId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${docId}/view/${filename}`);
  }

  ////////////////////////////////// FILE //////////////////////////////////

  public getDocFiles(docId: string): Observable<HaFile[]> {
    return this.apiService.get(`${this.route}/doc-files/${docId}`);
  }

  public getDocFilePrefix(docId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${docId}/file/`);
  }

  public getDocFilePath(docId: string, docFileId: string): string {
    return `${this.getDocFilePrefix(docId)}${docFileId}`;
  }

  uploadFile(file: File, docId: string): Observable<HaFile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${docId}`, formData);
  }

  deleteFile(entityId: string, name: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${entityId}/file/${name}`);
  }

  renameFile(docFileId: string, newName: string): Observable<HaFile> {
    return this.apiService.put(`${this.route}/file/${docFileId}/rename`, { humanName: newName }, HaFile);
  }

  getHistory(entityId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.apiService.get(`${this.route}/history/${entityId}/`, TeRichTextBlockModificationWithUser);
  }

  getPreviousVersion(entityId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/history/undo-content/${entityId}/${modificationId}`);
  }

  rollbackContent(entityId: string, modificationId: string): Observable<HaDocumentation> {
    return this.apiService.put(`${this.route}/history/rollback/${entityId}/${modificationId}`, {});
  }

  public urlToDownloadDocMarkdown(docId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/download-doc-markdown/${docId}`);
  }
}
