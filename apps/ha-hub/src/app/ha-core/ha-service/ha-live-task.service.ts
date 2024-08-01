import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {
  HaCreateLiveTaskDto,
  HaLiveTask,
  HaLiveTaskDatasourcePaginated
} from '../ha-model/ha-entities/ha-live-task.class';
import {Observable} from 'rxjs';
import {HaLiveTaskVersion, HaLiveTaskVersionFileInput} from '../ha-model/ha-entities/ha-live-task-version.class';
import {ClPage} from '@monorepo/core-lib';
import {HaBrickVersion} from '../ha-model/ha-entities/ha-brick-version.class';
import {TeRichTextContent, TeUploadedImage} from '@monorepo/text-editor';
import {HaCoAuthorService} from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import {HaUser} from '../ha-model/ha-entities/ha-user';
import {HaLiveTaskCoAuthorInvite} from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import {HaFile} from '../entity-module/ha-file-core/model/ha-file';
import {RvResourceView} from '@monorepo/resource-view';

@Injectable({
  providedIn: 'root'
})
export class HaLiveTaskService implements HaCoAuthorService {
  private readonly route: string = 'live-task';

  constructor(private apiService: FlApiService) {

  }

  ////////////////////////////////// Live Task //////////////////////////////////

  /**
   * Call http get to get all live tasks
   * return a list of live tasks
   */
  private getAll(page: number, size: number): Observable<ClPage<HaLiveTask>> {
    return this.apiService.get(this.route, HaLiveTask, {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getAllPaginated(): HaLiveTaskDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(page, size), 10);
  }

  /**
   * Call http post to get all live tasks with filters
   * @param spacesFilter
   * @param titleFilter
   * @param page
   * @param size
   * @return a list of live tasks
   */
  public getAllWithFilters(spacesFilter: string[], titleFilter: string, page: number, size: number): Observable<ClPage<HaLiveTask>> {
    return this.apiService.post(`${this.route}/filters`,
      {spacesFilter: spacesFilter, titleFilter: titleFilter}, HaLiveTask, {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getAllWithFiltersPaginated(pageSize: number = 10): HaLiveTaskDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllWithFilters(requestData.spacesFilter, requestData.titleFilter, page, size), pageSize, false);
  }

  public getUserLiveTasks(userId: string, page: number, size: number): Observable<ClPage<HaLiveTask>>{
    return this.apiService.get(`${this.route}/user/${userId}`, HaLiveTask, {page: page, pageSize: size, resultIsPaginated: true})
  }

  public getUserLiveTasksPaginated(pageSize: number = 4): HaLiveTaskDatasourcePaginated{
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) => this.getUserLiveTasks(requestData.userId, page, size), pageSize, false);
  }

  /**
   * Call http get to get a live task by id
   * @param id
   * @return a live task
   */
  public getLiveTaskById(id: string): Observable<HaLiveTask> {
    return this.apiService.get(`${this.route}/${id}`, HaLiveTask);
  }

  /**
   * Create a live task
   * @param createLiveTaskDto
   * @return the created live task
   */
  public create(createLiveTaskDto: HaCreateLiveTaskDto): Observable<HaLiveTaskVersion> {
    return this.apiService.post(this.route, createLiveTaskDto, HaLiveTask);
  }

  public updateTitle(liveTaskId: string, title: string): Observable<HaLiveTask> {
    return this.apiService.put(`${this.route}/${liveTaskId}/title`, {title: title}, HaLiveTask);
  }

  /**
   * Call http put to update a live task description
   * @param liveTaskId
   * @param description
   * @return the updated live task
   */
  public saveLiveTaskDescription(liveTaskId: string, description: Record<string, any>): Observable<HaLiveTask> {
    return this.apiService.put(`${this.route}/description/${liveTaskId}`, description, HaLiveTask);
  }

  public deleteLiveTask(id: string): Observable<any> {
    return this.apiService.delete(`${this.route}/${id}`);
  }


  //////////////////////////////////// Live Task Version //////////////////////////////////////

  /**
   * Call http get to get a live task version by live task id and version number
   * @param liveTaskId
   * @param versionNumber
   * @return the live task version
   */
  public getLiveTaskVersionByVersionNumber(liveTaskId: string, versionNumber: string): Observable<HaLiveTaskVersion> {
    return this.apiService.get(`${this.route}/${liveTaskId}/version/${versionNumber}`, HaLiveTaskVersion);
  }

  /**
   * Call http put to update a live task version environment
   * @param liveTaskVersionId
   * @param environment
   * @return the updated live task version
   */
  public saveLiveTaskVersionEnvironment(liveTaskVersionId: string, environment: string): Observable<HaLiveTaskVersion> {
    const environmentData = {environment: environment};
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/environment`, environmentData, HaLiveTaskVersion);
  }

  /**
   * Call http put to update a live task version params
   * @param liveTaskVersionId
   * @param params
   * @return the updated live task version
   */
  public saveLiveTaskVersionParams(liveTaskVersionId: string, params: string[]): Observable<HaLiveTaskVersion> {
    const paramsData = {params: params};
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/params`, paramsData, HaLiveTaskVersion);
  }

  /**
   * Call http put to update a live task version code
   * @param liveTaskVersionId
   * @param code
   * @return the updated live task version
   */
  public saveLiveTaskVersionCode(liveTaskVersionId: string, code: string): Observable<HaLiveTaskVersion> {
    const codeData = {code: code};
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/code`, codeData, HaLiveTaskVersion);
  }

  /**
   * Call http put to publish a live task version
   * @param liveTaskVersionId
   * @return the published live task version
   */
  publishLiveTaskVersion(liveTaskVersionId: string): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/publish`, null, HaLiveTaskVersion);
  }

  /**
   * Call http get to get the latest published live task version by live task id
   * @param liveTaskId
   * @return the latest live task version
   */
  getLatestLiveTaskVersionByLiveTaskId(liveTaskId: string): Observable<HaLiveTaskVersion> {
    return this.apiService.get(`${this.route}/${liveTaskId}/version/latest/`, HaLiveTaskVersion);
  }

  /**
   * Call http get to get all published live task versions by live task id
   * @param liveTaskId
   * @return a list of live task versions
   */
  getPublishedLiveTaskVersions(liveTaskId: string): Observable<HaLiveTaskVersion[]> {
    return this.apiService.get(`${this.route}/${liveTaskId}/versions/published`, HaLiveTaskVersion);
  }

  /**
   * Call http put to create a new draft version of a live task
   * @param liveTaskId
   * @param liveTaskVersionFile
   * @return the created live task version
   */
  createNewDraftVersion(liveTaskId: string, liveTaskVersionFile: HaLiveTaskVersionFileInput): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/${liveTaskId}/version/draft`, liveTaskVersionFile, HaLiveTaskVersion);
  }


  /**
   * Call http put to replace a draft version of a live task
   * @param liveTaskId
   * @param liveTaskVersionFile
   * @return the replaced live task version
   */
  replaceDraftVersion(liveTaskId: string, liveTaskVersionFile: HaLiveTaskVersionFileInput): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/${liveTaskId}/version/draft/replace`, liveTaskVersionFile, HaLiveTaskVersion);
  }

  /**
   * Call http put to save a live task version infos
   * @param liveTaskVersionId
   * @param versionInfos
   * @return the updated live task version
   */
  saveLiveTaskVersionInfos(liveTaskVersionId: string, versionInfos: TeRichTextContent): Observable<HaLiveTaskVersion> {
    return this.apiService.put(`${this.route}/version/${liveTaskVersionId}/infos`, versionInfos, HaLiveTaskVersion);
  }

  /**
   * Call http get to get live task version brick dependencies
   * @param liveTaskId
   * return the live task version brickVersions
   */
  getLiveTaskBrickDependencies(liveTaskId: string): Observable<HaBrickVersion[]> {
    return this.apiService.get(`${this.route}/${liveTaskId}/brick-dependencies`, HaBrickVersion);
  }

  /**
   * Call http get to get live task version brick dependencies
   * @param liveTaskVersionId
   * return the live task version brickVersions
   */
  getLiveTaskVersionBrickDependencies(liveTaskVersionId: string): Observable<HaBrickVersion[]> {
    return this.apiService.get(`${this.route}/version/${liveTaskVersionId}/brick-dependencies`, HaBrickVersion);
  }

  ////////////////////////////////////////// CO AUTHORS //////////////////////////////////////////

  acceptInvite(token: string): Observable<HaLiveTask> {
    return this.apiService.put(`${this.route}/invite/${token}/accept`, {}, HaLiveTask);
  }

  deleteCoAuthorInvite(inviteId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/invite/${inviteId}`);
  }

  getCoAuthors(id: string): Observable<HaUser[]> {
    return this.apiService.get(`${this.route}/${id}/co-authors`, HaUser);
  }

  getCoAuthorsPendingInvites(id: string): Observable<HaLiveTaskCoAuthorInvite[]> {
    return this.apiService.get(`${this.route}/${id}/co-authors-pending-invites`, HaLiveTaskCoAuthorInvite, {resultIsPaginated: false});
  }

  inviteCoAuthor(id: string, coAuthorMail: string): Observable<boolean> {
    return this.apiService.post(`${this.route}/${id}/invite-co-author`, {coAuthorMail: coAuthorMail}, Boolean);
  }

  isCoAuthorInviteValid(token: string): Observable<HaLiveTaskCoAuthorInvite> {
    return this.apiService.get(`${this.route}/invite/${token}/is-valid`, HaLiveTaskCoAuthorInvite);
  }

  removeCoAuthor(id: string, coAuthorId: string): Observable<HaLiveTask> {
    return this.apiService.put(`${this.route}/${id}/remove-co-author/${coAuthorId}`, {}, HaLiveTask);
  }

  uploadImage(file: File, liveTaskId: string): Observable<TeUploadedImage>{
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/image/${liveTaskId}`, formData);
  }

  getImageUrl(liveTaskId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${liveTaskId}/image/${name}`);
  }

  uploadFile(file: File, liveTaskId: string): Observable<HaFile>{
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${liveTaskId}`, formData);
  }

  public getFilePath(liveTaskId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${liveTaskId}/file/${name}`);
  }

  deleteFile(entityId: string, name: string): Observable<void>{
    return this.apiService.delete(`${this.route}/${entityId}/file/${name}`);
  }

  uploadResourceViewFile(liveTaskId: string, file: FormData): Observable<any>{
    return this.apiService.post(`${this.route}/view/${liveTaskId}`, file);
  }

  getView(liveTaskId: string, id: string): Observable<RvResourceView>{
    return this.apiService.get(`${this.route}/${liveTaskId}/view/${id}`);
  }

  deleteLiveTaskVersion(liveTaskVersionId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/version/${liveTaskVersionId}`);
  }
}
