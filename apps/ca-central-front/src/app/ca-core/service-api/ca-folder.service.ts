import { Injectable } from '@angular/core';
import {
  CaFolder,
  CaFolderStorageDTO,
  CaFolderWithHierarchy,
  CaGetFolderDescriptionDTO,
  CnSaveFolderDTO,
} from '../model/entities/folder/ca-folder.class';
import { Observable } from 'rxjs';
import { ClHelpService, ClPage, ClPageI } from '@monorepo/core-lib';
import { CaGroup } from '../model/entities/ca-group.entity';
import { CaUser } from '../model/entities/ca-user.class';
import { CaChatMessage, CaChatMessageDatasourcePaginated } from '../model/entities/ca-chat-message';
import { CaBucketLocationDTO } from '../model/entities/ca-object-storage.class';
import {
  CaConstellabDocument,
  CaDocument,
  CaDocumentDatasource,
  CaDocumentPreviewDTO,
  CaFolderStorageUsageDTO,
} from '../model/entities/folder/ca-document.class';
import { CaFolderUserConfig } from '../model/entities/folder/ca-folder-user.class';
import { CaActivity } from '../model/entities/ca-activity.class';
import {
  CaActivitySearch,
  CaActivitySearchFields,
} from '../entity-module/ca-activity-core/model/ca-activity-search.class';
import {
  TeBlockFigureData,
  TeBlockFigureUploadedResponse,
  TeBlockFileUploadResponse,
  TeRichText,
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
} from '@monorepo/text-editor';
import {
  FlApiService,
  FlDatasourceGetPageData,
  FlEntityPaginatedDatasource,
  FlSearchConverter,
} from '@monorepo/front-core-lib';
import {
  CaHierarchyObject,
  CaHierarchyObjectDatasource,
  CaHierarchyObjectWithChildren,
} from '../model/entities/folder/ca-hierarchy-object.class';
import {
  CaHierarchyObjectSearch,
  CaHierarchyObjectSearchFields,
} from '../entity-module/ca-hierarchy-object-core/model/ca-hierarchy-object-search.class';
import {
  CaFolderSearch,
  CaFolderSearchFields,
} from '../entity-module/ca-folder-core/model/ca-folder-search.class';

/**
 * Service to manage folder entity
 */
@Injectable({
  providedIn: 'root',
})
export class CaFolderService {
  private readonly route: string = 'folders';

  constructor(private apiService: FlApiService) {}

  public createFolder(folder: CnSaveFolderDTO): Observable<CaFolderWithHierarchy> {
    return this.apiService.post(this.route, folder, CaFolderWithHierarchy, { serialization: CaFolder });
  }

  public createSubFolder(
    subFolder: CnSaveFolderDTO,
    parentFolderId: string
  ): Observable<CaFolderWithHierarchy> {
    return this.apiService.post(
      `${this.route}/${parentFolderId}/sub-folder`,
      subFolder,
      CaFolderWithHierarchy,
      { serialization: CnSaveFolderDTO }
    );
  }

  public update(id: string, object: CnSaveFolderDTO): Observable<CaFolderWithHierarchy> {
    return this.apiService.put(`${this.route}/${id}`, object, CaFolderWithHierarchy, {
      serialization: CnSaveFolderDTO,
    });
  }

  public renameFolder(id: string, name: string): Observable<CaFolderWithHierarchy> {
    return this.apiService.put(`${this.route}/${id}/name`, { name: name }, CaFolderWithHierarchy);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getById(id: string): Observable<CaFolder> {
    return this.apiService.getById(this.route, id, CaFolder);
  }

  public getMyFoldersDatasource(pageSize: number = 20): CaHierarchyObjectDatasource {
    return new FlEntityPaginatedDatasource((page, size) => this.getMyFolders(page, size), pageSize);
  }

  private getMyFolders(page: number, pageSize: number): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.get(`${this.route}/current`, CaFolder, {
      resultIsPaginated: true,
      page: page,
      pageSize: pageSize,
    });
  }

  public shareFolder(id: string, groupId: string): Observable<CaGroup> {
    return this.apiService.put(`${this.route}/${id}/share/${groupId}`, null, CaGroup);
  }

  public unshareFolder(id: string, userId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/unshare/${userId}`);
  }

  public searchChildrenDatasource(
    id: string,
    filters?: CaHierarchyObjectSearchFields
  ): CaHierarchyObjectDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) =>
        this.searchChildren(id, page, pageSize, {
          filtersCriteria: filters,
          sortsCriteria: [{ key: 'name', direction: 'ASC' }],
        }),
      30
    );
  }

  public searchChildren(
    id: string,
    page: number,
    size: number,
    data: FlDatasourceGetPageData<CaHierarchyObjectSearchFields>
  ): Observable<ClPageI<CaHierarchyObject>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaHierarchyObjectSearch.filterConverter,
      CaHierarchyObjectSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/${id}/children/paginated`, searchInput, CaHierarchyObject, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public getObjectFolderAncestors(objectId: string): Observable<CaHierarchyObject[]> {
    return this.apiService.get(`${this.route}/${objectId}/ancestors`, CaHierarchyObject);
  }

  public getUsersOfFolder(folderId: string): Observable<CaUser[]> {
    return this.apiService.get(`${this.route}/${folderId}/users`, CaUser);
  }

  public updateFolderLeader(id: string, userId: string): Observable<CaFolder> {
    return this.apiService.put(`${this.route}/${id}/leader/${userId}`, null, CaFolder);
  }

  public getFolderTree(objectId: string): Observable<CaHierarchyObjectWithChildren> {
    return this.apiService.get(`${this.route}/tree/${objectId}`, CaHierarchyObjectWithChildren);
  }

  public getFolderByCurrentSpaceDatasource(): CaHierarchyObjectDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getFolderByCurrentSpace(page, pageSize),
      20
    );
  }

  public getFolderByCurrentSpace(page: number, size: number): Observable<ClPageI<CaHierarchyObject>> {
    return this.apiService.get(`${this.route}/current-space`, CaFolder, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public searchFoldersInCurrentSpace(
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaFolderSearchFields>
  ): Observable<ClPageI<CaFolder>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaFolderSearch.filterConverter,
      CaFolderSearch.sortConverter
    );
    return this.apiService.post(`${this.route}/current-space/search`, searchInput, CaFolder, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  /////////////////////////////////// DESCRIPTION //////////////////////////////////

  public getFolderDescription(id: string): Observable<CaGetFolderDescriptionDTO> {
    return this.apiService.get(`${this.route}/${id}/description`, CaGetFolderDescriptionDTO);
  }

  public updateDescription(id: string, description: TeRichText): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/description`, description.toJson());
  }

  uploadDescriptionImage(folderId: string, file: File): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${folderId}/description/image`, formData);
  }

  public getDescriptionImageUrl(folderId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${folderId}/description/image/${filename}`);
  }

  /////////////////////////////// CHAT //////////////////////////////////

  public getChatRootFolders(): Observable<CaHierarchyObjectWithChildren[]> {
    return this.apiService.get(`${this.route}/chat/folder-tree`, CaHierarchyObjectWithChildren);
  }

  /////////////////////////////// MESSAGE //////////////////////////////////
  public activateChat(folderId: string, enable: boolean): Observable<CaFolder> {
    return this.apiService.put(`${this.route}/${folderId}/chat/${enable}`, null, CaFolder);
  }

  public getFolderMessagesDatasource(folderId: string): CaChatMessageDatasourcePaginated {
    return new FlEntityPaginatedDatasource((page, size) => this.getFolderMessages(folderId, page, size), 15);
  }

  public getFolderMessages(folderId: string, page: number, size: number): Observable<ClPage<CaChatMessage>> {
    return this.apiService.get(`${this.route}/${folderId}/chat/message`, CaChatMessage, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public createMessage(folderId: string, richText: TeRichText): Observable<CaChatMessage> {
    return this.apiService.post(
      `${this.route}/${folderId}/chat/message`,
      { content: richText.toJson() },
      CaChatMessage
    );
  }

  public updateMessage(folderId: string, messageId: string, richText: TeRichText): Observable<CaChatMessage> {
    return this.apiService.put(
      `${this.route}/${folderId}/chat/message/${messageId}`,
      { content: richText.toJson() },
      CaChatMessage
    );
  }

  public deleteMessage(folderId: string, messageId: string): Observable<CaChatMessage> {
    return this.apiService.delete(`${this.route}/${folderId}/chat/message/${messageId}/delete`, null);
  }

  uploadMessageImage(file: File, folderId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${folderId}/chat/message/image`, formData);
  }

  public getMessageImageUrl(filename: string, folderId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${folderId}/chat/message/image/${filename}`);
  }

  //////////////////////////////////// DOCUMENTS ///////////////////////////////////////////
  public uploadDocument(file: File, folderId: string): Observable<CaHierarchyObject> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${folderId}/document`, formData, CaHierarchyObject);
  }

  public getDocumentPreviewUrl(documentId: string, documentName: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/document/${documentId}/preview/${documentName}`);
  }

  public getDocumentDownloadUrl(documentId: string, documentName: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/document/${documentId}/download/${documentName}`);
  }

  public deleteDocument(documentId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/document/${documentId}`);
  }

  public renameDocument(documentId: string, name: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/rename`, { name: name }, CaDocument);
  }

  public getTrashedDocuments(folderId: string): CaDocumentDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) =>
        this.apiService.get(`${this.route}/${folderId}/document/trashed`, CaDocument, {
          page: page,
          pageSize: size,
          resultIsPaginated: true,
        }),
      20
    );
  }

  public moveDocumentToTrash(documentId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/move-to-trash`, null, CaDocument);
  }

  public restoreDocumentFromTrash(documentId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/restore-from-trash`, null, CaDocument);
  }

  public emptyTrash(folderId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${folderId}/empty-trash`, null);
  }

  public moveDocumentToFolder(documentId: string, folderId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/move/${folderId}`, null, CaDocument);
  }

  //////////////////////////////////// CONSTELLAB DOCUMENT ///////////////////////////////////////////

  public createConstellabDocument(
    parentFolderId: string,
    filename: string
  ): Observable<CaConstellabDocument> {
    return this.apiService.post(
      `${this.route}/${parentFolderId}/constellab-document`,
      { name: filename },
      CaConstellabDocument
    );
  }

  public updateConstellabDocument(
    documentId: string,
    richText: TeRichText
  ): Observable<CaConstellabDocument> {
    return this.apiService.put(
      `${this.route}/constellab-document/${documentId}`,
      richText.toJson(),
      CaConstellabDocument,
      { hideSnackBarError: true }
    );
  }

  // raise an error if the document is 'locked'
  public checkEditConstellabDocument(documentId: string): Observable<boolean> {
    return this.apiService.get(`${this.route}/constellab-document/${documentId}/check-edit`);
  }

  public getConstellabDocument(documentId: string): Observable<CaConstellabDocument> {
    return this.apiService.get(`${this.route}/constellab-document/${documentId}`, CaConstellabDocument);
  }

  public uploadImageToConstellabDocument(file: File, documentId: string): Observable<TeBlockFigureData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/constellab-document/${documentId}/image`, formData);
  }

  public uploadFileToConstellabDocument(
    file: File,
    documentId: string
  ): Observable<TeBlockFileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/constellab-document/${documentId}/file`, formData);
  }

  public getConstellabDocumentFileUrl(documentId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(
      `${this.route}/constellab-document/${documentId}/file/${filename}`
    );
  }

  getConstellabDocumentHistory(documentId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.apiService.get(
      `${this.route}/constellab-document/${documentId}/history/`,
      TeRichTextBlockModificationWithUser
    );
  }

  getConstellabDocumentUndoContent(documentId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(
      `${this.route}/constellab-document/${documentId}/history/undo-content/${modificationId}`
    );
  }

  rollbackConstellabDocumentContent(documentId: string, modificationId: string): Observable<CaDocument> {
    return this.apiService.put(
      `${this.route}/constellab-document/${documentId}/history/rollback/${modificationId}`,
      {}
    );
  }

  /////////////////////////////// DOCUMENT PREVIEW  ///////////////////////////////////////////
  public generateDocumentPreview(documentId: string): Observable<CaDocumentPreviewDTO> {
    return this.apiService.post(
      `${this.route}/document/${documentId}/preview-token`,
      null,
      CaDocumentPreviewDTO
    );
  }

  /////////////////////////////// BUCKET ///////////////////////////////////////////
  public getFolderStorages(folderId: string): Observable<CaFolderStorageDTO | null> {
    return this.apiService.get(`${this.route}/${folderId}/storage`, CaFolderStorageDTO);
  }

  public createFolderBuckets(
    folderId: string,
    createBucket: CaFolderStorageDTO
  ): Observable<CaFolderStorageDTO> {
    return this.apiService.post(`${this.route}/${folderId}/storage`, createBucket, CaFolderStorageDTO);
  }

  public findAccessibleFolderBucketLocation(
    page: number,
    size: number
  ): Observable<ClPageI<CaBucketLocationDTO>> {
    return this.apiService.get(`${this.route}/storage/buckets`, CaBucketLocationDTO, {
      resultIsPaginated: true,
      page: page,
      pageSize: size,
    });
  }

  public getFolderStorageSize(folderId: string): Observable<CaFolderStorageUsageDTO> {
    return this.apiService.get(`${this.route}/${folderId}/storage/size`, CaFolderStorageUsageDTO);
  }

  /////////////////////////////// USER ///////////////////////////////////////////
  getFolderUserConfig(folderId: string): Observable<CaFolderUserConfig> {
    return this.apiService.get(`${this.route}/${folderId}/user-config`, CaFolderUserConfig);
  }

  updateFolderUserConfig(folderId: string, folderUser: CaFolderUserConfig): Observable<CaFolderUserConfig> {
    return this.apiService.put(`${this.route}/${folderId}/user-config`, folderUser, CaFolderUserConfig);
  }

  public searchFolderUser(
    folderId: string,
    name: string,
    page: number,
    pageSize: number
  ): Observable<ClPage<CaUser>> {
    if (ClHelpService.isNullOrEmpty(name)) name = '';
    return this.apiService.get(`${this.route}/${folderId}/users/search/name/${name}`, CaUser, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }

  /////////////////////////////// ACTIVITY ///////////////////////////////////////////
  public searchActivity(
    folderId: string,
    page: number,
    pageSize: number,
    data: FlDatasourceGetPageData<CaActivitySearchFields>
  ): Observable<ClPageI<CaActivity>> {
    const searchInput = FlSearchConverter.convertDatasourceGetPageDataToSearchParams(
      data,
      CaActivitySearch.filterConverter,
      CaActivitySearch.sortConverter
    );
    return this.apiService.post(`${this.route}/${folderId}/activity`, searchInput, CaActivity, {
      page: page,
      pageSize: pageSize,
      resultIsPaginated: true,
    });
  }
}
