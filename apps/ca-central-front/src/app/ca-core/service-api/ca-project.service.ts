import {Injectable} from '@angular/core';
import {
  CaProject,
  CaProjectAncestorTreeDTO,
  CaProjectAncestorType,
  CaProjectDatasource,
  CaProjectStatus,
  CaProjectStatusHistory,
  CaProjectStorageDTO,
  CaProjectTreeDto,
  CnSaveProjectDTO
} from '../model/entities/project/ca-project.class';
import {Observable} from 'rxjs';
import {
  FlAdvancedSearchInput,
  FlApiService,
  FlArrayObs,
  FlEntityArrayObs,
  FlEntityPaginatedDatasource,
  FlQuillJson,
  FlSearchConverter,
  FlTextEditorUploadedImage,
} from '@monorepo/front-core-lib';
import {ClPage, ClPageI, ClRichTextFigure, ClRichTextI} from '@monorepo/core-lib';
import {CaGroup} from '../model/entities/ca-group.entity';
import {CaUser} from '../model/entities/ca-user.class';
import {CaProjectComment, CaProjectCommentDatasourcePaginated} from '../model/entities/ca-comment.class';
import {CaProjectSearch, CaProjectSearchFields} from '../entity-module/ca-project-core/model/ca-project-search.class';
import {CaBucketLocationDTO} from '../model/entities/ca-object-storage.class';
import {CaConstellabDocument, CaDocument, CaDocumentDatasource} from '../model/entities/project/ca-document.class';
import {CaProjectUserConfig} from '../model/entities/project/ca-project-user.class';
import {CaActivity} from '../model/entities/ca-activity.class';
import {
  CaActivitySearch,
  CaActivitySearchFields
} from '../entity-module/ca-activity-core/model/ca-activity-search.class';

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

  public createProject(project: CnSaveProjectDTO): Observable<CaProject> {
    return this.apiService.post(this.route, project, CaProject, {serialization: CaProject});
  }

  public createSubProject(subProject: CnSaveProjectDTO, parentProjectId: string): Observable<CaProject> {
    return this.apiService.post(`${this.route}/${parentProjectId}/sub-project`, subProject, CaProject,
      {serialization: CnSaveProjectDTO});
  }


  public update(id: string, object: CnSaveProjectDTO): Observable<CaProject> {
    return this.apiService.put(`${this.route}/${id}`, object, CaProject, {serialization: CnSaveProjectDTO});
  }

  public delete(id: string): Observable<void> {
    return this.apiService.deleteById(this.route, id);
  }

  public getById(id: string): Observable<CaProject> {
    return this.apiService.getById(this.route, id, CaProject);
  }

  public getMyProjectsDatasource(pageSize: number = 20): CaProjectDatasource {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getMyProjects(page, size), pageSize);
  }

  private getMyProjects(page: number, pageSize: number): Observable<ClPageI<CaProject>> {
    return this.apiService.get(`${this.route}/current`, CaProject,
      {resultIsPaginated: true, page: page, pageSize: pageSize});
  }

  public getProjectByCurrentSpaceDatasource(): CaProjectDatasource {
    return new FlEntityPaginatedDatasource(
      (page, pageSize) => this.getProjectByCurrentSpace(page, pageSize),
      20);
  }

  public getProjectByCurrentSpace(page: number, size: number): Observable<ClPageI<CaProject>> {
    return this.apiService.get(`${this.route}/current-space`, CaProject,
      {resultIsPaginated: true, page: page, pageSize: size});
  }

  // use to pass the updateStatus method to UpdateStatusFormDialog
  public getUpdateStatusMethod(id: string): (status: CaProjectStatus) => Observable<CaProject> {
    return (status => this.updateStatus(id, status));
  }

  public updateStatus(id: string, status: CaProjectStatus): Observable<CaProject> {
    return this.apiService.put(`${this.route}/${id}/status/${status}`,
      null, CaProject);
  }

  public getStatusHistories(id: string): FlArrayObs<CaProjectStatusHistory> {
    return new FlEntityArrayObs(this.apiService.get(`${this.route}/${id}/status-history`, CaProjectStatusHistory));
  }

  public shareProject(id: string, groupId: string): Observable<CaGroup> {
    return this.apiService.put(`${this.route}/${id}/share/${groupId}`, null, CaGroup);
  }

  public unshareProject(id: string, userId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${id}/unshare/${userId}`);
  }

  public getOnGoingProjectsNumber(): Observable<number> {
    return this.apiService.get(`${this.route}/on-going-projects-number`);
  }

  public getChildren(id: string): Observable<CaProject[]> {
    return this.apiService.get(`${this.route}/${id}/children`, CaProject);
  }

  public getObjectProjectAncestors(objectType: CaProjectAncestorType, objectId: string): Observable<CaProjectAncestorTreeDTO[]> {
    return this.apiService.get(`${this.route}/ancestors/${objectType}/${objectId}`);
  }

  public getUsersOfProject(projectId: string): Observable<CaUser[]> {
    return this.apiService.get(`${this.route}/${projectId}/users`, CaUser);
  }

  public updateProjectLeader(id: string, userId: string): Observable<CaProject> {
    return this.apiService.put(`${this.route}/${id}/leader/${userId}`, null, CaProject);
  }


  public getProjectTree(objectType: CaProjectAncestorType, objectId: string): Observable<CaProjectTreeDto> {
    return this.apiService.get(`${this.route}/tree/${objectType}/${objectId}`);
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

  public getProjectDescription(id: string): Observable<FlQuillJson> {
    return this.apiService.get(`${this.route}/${id}/description`);
  }

  public updateDescription(id: string, description: string): Observable<CaProject> {
    return this.apiService.put(`${this.route}/${id}/description`, description, CaProject);
  }

  uploadDescriptionImage(projectId: string, file: File): Observable<FlTextEditorUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${projectId}/description/image`, formData);
  }

  public getDescriptionImageUrl(projectId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${projectId}/description/image/${filename}`);
  }

  /////////////////////////////// COMMENTS //////////////////////////////////
  public getProjectComments(userId: string): CaProjectCommentDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(userId, page, size), 20);
  }

  public getAll(projectId: string, page: number, size: number): Observable<ClPage<CaProjectComment>> {
    return this.apiService.get(`${this.route}/${projectId}/comments`, CaProjectComment,
      {page: page, pageSize: size, resultIsPaginated: true});
  }

  public newProjectComment(projectId: string, content: ClRichTextI, parentCommentId?: string): Observable<CaProjectComment> {
    return this.apiService.post(`${this.route}/${projectId}/comment`,
      {content: content, parentCommentId: parentCommentId}, CaProjectComment);
  }

  public editProjectComment(projectId: string, commentId: string, content: ClRichTextI): Observable<CaProjectComment> {
    return this.apiService.put(`${this.route}/${projectId}/comment/${commentId}`,
      {content: content}, CaProjectComment);
  }

  public deleteProjectComment(projectId: string, commentId: string): Observable<CaProjectComment> {
    return this.apiService.delete(`${this.route}/${projectId}/comment/${commentId}/delete`, null);
  }

  uploadCommentImage(file: File, projectId: string): Observable<FlTextEditorUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/${projectId}/comment/image`, formData);
  }

  public getCommentImageUrl(filename: string, projectId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${projectId}/comment/image/${filename}`);
  }


  //////////////////////////////////// DOCUMENTS ///////////////////////////////////////////
  public uploadDocument(file: File, projectId: string): Observable<CaDocument> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/${projectId}/document`, formData, CaDocument);
  }

  public getDocumentPreviewUrl(projectId: string, documentId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${projectId}/document/preview/${documentId}`);
  }

  public getDocumentDownloadUrl(projectId: string, documentId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${projectId}/document/download/${documentId}`);
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
    return this.apiService.put(`${this.route}/document/${documentId}/rename`, {name: name}, CaDocument);
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

  //////////////////////////////////// CONSTELLAB DOCUMENT ///////////////////////////////////////////

  public createConstellabDocument(projectId: string, filename: string): Observable<CaConstellabDocument> {
    return this.apiService.post(`${this.route}/${projectId}/constellab-document`, {name: filename}, CaConstellabDocument);
  }

  public updateConstellabDocument(documentId: string, content: ClRichTextI): Observable<CaConstellabDocument> {
    return this.apiService.put(`${this.route}/constellab-document/${documentId}`, content, CaConstellabDocument);
  }

  public getConstellabDocument(documentId: string): Observable<CaConstellabDocument> {
    return this.apiService.get(`${this.route}/constellab-document/${documentId}`, CaConstellabDocument);
  }

  public uploadConstellabDocumentImage(file: File, documentId: string): Observable<ClRichTextFigure> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/constellab-document/${documentId}/image`, formData);
  }

  public getConstellabDocumentImageUrl(documentId: string, filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/constellab-document/${documentId}/image/${filename}`);
  }


  /////////////////////////////// Project Bucket ///////////////////////////////////////////
  public getProjectStorages(projectId: string): Observable<CaProjectStorageDTO | null> {
    return this.apiService.get(`${this.route}/${projectId}/storage`, CaProjectStorageDTO);
  }

  public createProjectBuckets(projectId: string, createBucket: CaProjectStorageDTO): Observable<CaProjectStorageDTO> {
    return this.apiService.post(`${this.route}/${projectId}/storage`, createBucket, CaProjectStorageDTO);
  }

  public findAccessibleProjectBucketLocation(page: number, size: number): Observable<ClPageI<CaBucketLocationDTO>> {
    return this.apiService.get(`${this.route}/storage/buckets`, CaBucketLocationDTO,
      {resultIsPaginated: true, page: page, pageSize: size});
  }

  /////////////////////////////// Project user ///////////////////////////////////////////
  getProjectUserConfig(projectId: string): Observable<CaProjectUserConfig> {
    return this.apiService.get(`${this.route}/${projectId}/user-config`, CaProjectUserConfig);
  }

  updateProjectUserConfig(projectId: string, projectUser: CaProjectUserConfig): Observable<CaProjectUserConfig> {
    return this.apiService.put(`${this.route}/${projectId}/user-config`, projectUser, CaProjectUserConfig);
  }

  /////////////////////////////// Activity ///////////////////////////////////////////
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
