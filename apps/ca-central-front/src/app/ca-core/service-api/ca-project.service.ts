import { Injectable } from '@angular/core';
import {
  CaProject,
  CaProjectDatasource,
  CaProjectStorageDTO, CaProjectWithFolder,
  CnSaveProjectDTO
} from '../model/entities/project/ca-project.class';
import { delay, Observable } from 'rxjs';
import { ClHelpService, ClPage, ClPageI } from '@monorepo/core-lib';
import { CaGroup } from '../model/entities/ca-group.entity';
import { CaUser } from '../model/entities/ca-user.class';
import { CaProjectComment, CaProjectCommentDatasourcePaginated } from '../model/entities/ca-comment.class';
import { CaProjectSearch, CaProjectSearchFields } from '../entity-module/ca-project-core/model/ca-project-search.class';
import { CaBucketLocationDTO } from '../model/entities/ca-object-storage.class';
import {
  CaConstellabDocument,
  CaDocument,
  CaDocumentDatasource,
  CaProjectDocumentPreviewDTO,
  CaProjectStorageUsageDTO
} from '../model/entities/project/ca-document.class';
import { CaProjectUserConfig } from '../model/entities/project/ca-project-user.class';
import { CaActivity } from '../model/entities/ca-activity.class';
import {
  CaActivitySearch,
  CaActivitySearchFields
} from '../entity-module/ca-activity-core/model/ca-activity-search.class';
import { TeFigureBlockData, TeFileBlockData, TeRichTextContent, TeUploadedImage } from '@monorepo/text-editor';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlEntityPaginatedDatasource,
  FlSearchConverter
} from '@monorepo/front-core-lib';
import { CaFolder, CaFolderDatasource, CaFolderWithChildren } from '../model/entities/project/ca-folder.class';
import { CaFolderSearch, CaFolderSearchFields } from '../entity-module/ca-folder-core/model/ca-folder-search.class';

/**
 * Service to manage project entity
 */
@Injectable({
  providedIn: 'root'
})
export class CaProjectService {

  private readonly route: string = 'projects';

  constructor(private apiService: FlApiService) {
  }

  public createProject(project: CnSaveProjectDTO): Observable<CaProjectWithFolder> {
    return this.apiService.post(this.route, project, CaProjectWithFolder, { serialization: CaProject });
  }

  public createSubProject(subProject: CnSaveProjectDTO, parentProjectId: string): Observable<CaProjectWithFolder> {
    return this.apiService.post(`${this.route}/${parentProjectId}/sub-project`, subProject, CaProjectWithFolder,
      { serialization: CnSaveProjectDTO });
  }


  public update(id: string, object: CnSaveProjectDTO): Observable<CaProjectWithFolder> {
    return this.apiService.put(`${this.route}/${id}`, object, CaProjectWithFolder, { serialization: CnSaveProjectDTO });
  }

  public activateChat(projectId: string, enable: boolean): Observable<CaProject> {
    return this.apiService.put(`${this.route}/${projectId}/chat/${enable}`, null, CaProject);
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getById(id: string): Observable<CaProject> {
    return this.apiService.getById(this.route, id, CaProject);
  }

  public getMyFoldersDatasource(pageSize: number = 20): CaFolderDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getMyFolders(page, size), pageSize);
  }

  private getMyFolders(page: number, pageSize: number): Observable<ClPageI<CaFolder>> {
    return this.apiService.get(`${this.route}/current`, CaProject,
      { resultIsPaginated: true, page: page, pageSize: pageSize });
  }

  public getProjectByCurrentSpaceDatasource(): CaFolderDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getProjectByCurrentSpace(page, pageSize),
      20);
  }

  public getProjectByCurrentSpace(page: number, size: number): Observable<ClPageI<CaFolder>> {
    return this.apiService.get(`${this.route}/current-space`, CaProject,
      { resultIsPaginated: true, page: page, pageSize: size });
  }

  public shareProject(id: string, groupId: string): Observable<CaGroup> {
    return this.apiService.put(`${this.route}/${id}/share/${groupId}`, null, CaGroup);
  }

  public unshareProject(id: string, userId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/unshare/${userId}`);
  }

  public searchChildrenDatasource(id: string, filters?: CaFolderSearchFields): CaFolderDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.searchChildren(id, page, pageSize, filters),
      30);
  }

  public searchChildren(id: string, page: number, size: number, filters?: Partial<CaFolderSearchFields>): Observable<ClPageI<CaFolder>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, CaFolderSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/${id}/children/paginated`, data, CaProject,
      { resultIsPaginated: true, page: page, pageSize: size });
  }

  public getObjectProjectAncestors(objectId: string): Observable<CaFolder[]> {
    return this.apiService.get(`${this.route}/${objectId}/ancestors`, CaFolder);
  }

  public getUsersOfProject(projectId: string): Observable<CaUser[]> {
    return this.apiService.get(`${this.route}/${projectId}/users`, CaUser);
  }

  public updateProjectLeader(id: string, userId: string): Observable<CaProject> {
    return this.apiService.put(`${this.route}/${id}/leader/${userId}`, null, CaProject);
  }

  public getProjectTree(objectId: string): Observable<CaFolderWithChildren> {
    return this.apiService.get(`${this.route}/tree/${objectId}`, CaFolderWithChildren);
  }

  public searchInCurrentSpace(page: number, pageSize: number, filters?: CaProjectSearchFields): Observable<ClPageI<CaProject>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, CaProjectSearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/current-space/search`, data, CaProject, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  /////////////////////////////////// DESCRIPTION //////////////////////////////////

  public getProjectDescription(id: string): Observable<TeRichTextContent> {
    return this.apiService.get(`${this.route}/${id}/description`);
  }

  public updateDescription(id: string, description: TeRichTextContent): Observable<void> {
    return this.apiService.put(`${this.route}/${id}/description`, description);
  }

  uploadDescriptionImage(projectId: string, file: File): Observable<TeUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${projectId}/description/image`, formData);
  }

  public getDescriptionImageUrl(projectId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${projectId}/description/image/${filename}`);
  }

  /////////////////////////////// CHAT //////////////////////////////////

  public getChatRootFolders(): Observable<CaFolderWithChildren[]> {
    return this.apiService.get(`${this.route}/chat/folder-tree`, CaFolderWithChildren);
  }

  /////////////////////////////// COMMENTS //////////////////////////////////
  public getComments(userId: string): CaProjectCommentDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(userId, page, size), 15);
  }

  public getAll(projectId: string, page: number, size: number): Observable<ClPage<CaProjectComment>> {
    return this.apiService.get(`${this.route}/${projectId}/comments`, CaProjectComment,
      { page: page, pageSize: size, resultIsPaginated: true });
  }

  public createComment(projectId: string, content: TeRichTextContent, parentCommentId?: string): Observable<CaProjectComment> {
    return this.apiService.post(`${this.route}/${projectId}/comment`,
      { content: content, parentCommentId: parentCommentId }, CaProjectComment);
  }

  public updateComment(projectId: string, commentId: string, content: TeRichTextContent): Observable<CaProjectComment> {
    return this.apiService.put(`${this.route}/${projectId}/comment/${commentId}`,
      { content: content }, CaProjectComment);
  }

  public deleteComment(projectId: string, commentId: string): Observable<CaProjectComment> {
    return this.apiService.delete(`${this.route}/${projectId}/comment/${commentId}/delete`, null);
  }

  uploadCommentImage(file: File, projectId: string): Observable<TeUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${projectId}/comment/image`, formData);
  }

  public getCommentImageUrl(filename: string, projectId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${projectId}/comment/image/${filename}`);
  }


  //////////////////////////////////// DOCUMENTS ///////////////////////////////////////////
  public uploadDocument(file: File, projectId: string): Observable<CaFolder> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${projectId}/document`, formData, CaFolder);
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

  public getDocuments(projectId: string, page: number, size: number): Observable<ClPageI<CaDocument>> {
    return this.apiService.get(`${this.route}/${projectId}/document`, CaDocument, {
      page: page, pageSize: size, resultIsPaginated: true
    });
  }

  public getDocumentsDatasource(projectId: string): CaDocumentDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getDocuments(projectId, page, size), 20);
  }

  public renameDocument(documentId: string, name: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/rename`, { name: name }, CaDocument);
  }

  public getTrashedDocuments(projectId: string): CaDocumentDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.apiService.get(`${this.route}/${projectId}/document/trashed`, CaDocument, {
        page: page, pageSize: size, resultIsPaginated: true
      }), 20);
  }

  public moveDocumentToTrash(documentId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/move-to-trash`, null, CaDocument);
  }

  public restoreDocumentFromTrash(documentId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/restore-from-trash`, null, CaDocument);
  }

  public emptyTrash(projectId: string): Observable<void> {
    return this.apiService.put(`${this.route}/${projectId}/empty-trash`, null);
  }

  public moveDocumentToProject(documentId: string, projectId: string): Observable<CaDocument> {
    return this.apiService.put(`${this.route}/document/${documentId}/move/${projectId}`, null, CaDocument);
  }

  //////////////////////////////////// CONSTELLAB DOCUMENT ///////////////////////////////////////////

  public createConstellabDocument(parentFolderId: string, filename: string): Observable<CaConstellabDocument> {
    return this.apiService.post(`${this.route}/${parentFolderId}/constellab-document`, { name: filename }, CaConstellabDocument);
  }

  public updateConstellabDocument(documentId: string, content: TeRichTextContent): Observable<CaConstellabDocument> {
    return this.apiService.put(`${this.route}/constellab-document/${documentId}`, content, CaConstellabDocument);
  }

  public getConstellabDocument(documentId: string): Observable<CaConstellabDocument> {
    return this.apiService.get(`${this.route}/constellab-document/${documentId}`, CaConstellabDocument);
  }

  public uploadImageToConstellabDocument(file: File, documentId: string): Observable<TeFigureBlockData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/constellab-document/${documentId}/image`, formData);
  }

  public uploadFileToConstellabDocument(file: File, documentId: string): Observable<TeFileBlockData> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/constellab-document/${documentId}/file`, formData);
  }

  public getConstellabDocumentFileUrl(documentId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/constellab-document/${documentId}/file/${filename}`);
  }


  /////////////////////////////// DOCUMENT PREVIEW  ///////////////////////////////////////////
  public generateDocumentPreview(documentId: string): Observable<CaProjectDocumentPreviewDTO> {
    return this.apiService.post(`${this.route}/document/${documentId}/preview-token`, null, CaProjectDocumentPreviewDTO);
  }


  /////////////////////////////// BUCKET ///////////////////////////////////////////
  public getProjectStorages(projectId: string): Observable<CaProjectStorageDTO | null> {
    return this.apiService.get(`${this.route}/${projectId}/storage`, CaProjectStorageDTO);
  }

  public createProjectBuckets(projectId: string, createBucket: CaProjectStorageDTO): Observable<CaProjectStorageDTO> {
    return this.apiService.post(`${this.route}/${projectId}/storage`, createBucket, CaProjectStorageDTO);
  }

  public findAccessibleProjectBucketLocation(page: number, size: number): Observable<ClPageI<CaBucketLocationDTO>> {
    return this.apiService.get(`${this.route}/storage/buckets`, CaBucketLocationDTO,
      { resultIsPaginated: true, page: page, pageSize: size });
  }

  public getProjectStorageSize(projectId: string): Observable<CaProjectStorageUsageDTO> {
    return this.apiService.get(`${this.route}/${projectId}/storage/size`, CaProjectStorageUsageDTO);
  }

  /////////////////////////////// USER ///////////////////////////////////////////
  getProjectUserConfig(projectId: string): Observable<CaProjectUserConfig> {
    return this.apiService.get(`${this.route}/${projectId}/user-config`, CaProjectUserConfig);
  }

  updateProjectUserConfig(projectId: string, projectUser: CaProjectUserConfig): Observable<CaProjectUserConfig> {
    return this.apiService.put(`${this.route}/${projectId}/user-config`, projectUser, CaProjectUserConfig);
  }

  public searchProjectUser(projectId: string, name: string,
                           page: number, pageSize: number): Observable<ClPage<CaUser>> {
    if (ClHelpService.isNullOrEmpty(name)) name = '';
    return this.apiService.get(`${this.route}/${projectId}/users/search/name/${name}`, CaUser, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }

  /////////////////////////////// ACTIVITY ///////////////////////////////////////////
  public searchActivity(projectId: string, page: number, pageSize: number,
                        filters?: CaActivitySearchFields): Observable<ClPageI<CaActivity>> {
    const data: FlAdvancedSearchInput = {
      filtersCriteria: FlSearchConverter.convertObjectToSearchCriteriaList(filters, CaActivitySearch.advancedSearchConverter),
      sortsCriteria: null
    };
    return this.apiService.post(`${this.route}/${projectId}/activity`, data, CaActivity, {
      page: page, pageSize: pageSize, resultIsPaginated: true
    });
  }
}
