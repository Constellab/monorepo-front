import { Injectable } from '@angular/core';
import { FlApiService, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import {
  HaCreateAgentDto,
  HaAgent,
  HaAgentDatasourcePaginated, HaAgentDatasourceFilters
} from '../ha-model/ha-entities/ha-agent.class';
import { Observable } from 'rxjs';
import { HaAgentVersion, HaAgentVersionFileInput } from '../ha-model/ha-entities/ha-agent-version.class';
import { ClPage } from '@monorepo/core-lib';
import { HaBrickVersion } from '../ha-model/ha-entities/ha-brick-version.class';
import { TeRichTextContent, TeUploadedImage } from '@monorepo/text-editor';
import { HaCoAuthorService } from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import { HaUser } from '../ha-model/ha-entities/ha-user';
import { HaAgentCoAuthorInvite } from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaFile } from '../entity-module/ha-file-core/model/ha-file';
import { RvResourceView } from '@monorepo/resource-view';
import { HaProfileDatasourceFilters } from '../../ha-profile/component/ha-profile/ha-profile.component';
import {
  HaAgentEditStyleFormData
} from '../../ha-agent/components/ha-agent-edit-style-dialog/ha-agent-edit-style-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class HaAgentService implements HaCoAuthorService {
  private readonly route: string = 'agent';

  constructor(private apiService: FlApiService) {

  }

  ////////////////////////////////// Agent //////////////////////////////////

  /**
   * Call http post to get all agents with filters
   * @param spacesFilter
   * @param titleFilter
   * @param page
   * @param size
   * @return a list of agents
   */
  getAllWithFilters(spacesFilter: string[], titleFilter: string, page: number, size: number): Observable<ClPage<HaAgent>> {
    return this.apiService.post(`${this.route}/filters`,
      {spacesFilter: spacesFilter, titleFilter: titleFilter}, HaAgent, {page: page, pageSize: size, resultIsPaginated: true});
  }

  getAllWithFiltersPaginated(pageSize: number = 10): HaAgentDatasourcePaginated<HaAgentDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) =>
        this.getAllWithFilters(requestData.filtersCriteria.spacesFilter,
          requestData.filtersCriteria.titleFilter, page, size), pageSize, false);
  }

  getUserAgents(userId: string, page: number, size: number): Observable<ClPage<HaAgent>>{
    return this.apiService.get(`${this.route}/user/${userId}`, HaAgent, {page: page, pageSize: size, resultIsPaginated: true})
  }

  getUserAgentsPaginated(pageSize: number = 4): HaAgentDatasourcePaginated<HaProfileDatasourceFilters>{
    return new FlEntityPaginatedDatasource(
      (page, size, requestData) => this.getUserAgents(requestData.filtersCriteria.userId, page, size), pageSize, false);
  }

  /**
   * Call http get to get a agent by id
   * @param id
   * @return a agent
   */
  getAgentById(id: string): Observable<HaAgent> {
    return this.apiService.get(`${this.route}/${id}`, HaAgent);
  }

  /**
   * Create a agent
   * @param createAgentDto
   * @return the created agent
   */
  create(createAgentDto: HaCreateAgentDto): Observable<HaAgentVersion> {
    return this.apiService.post(this.route, createAgentDto, HaAgent);
  }

  updateTitle(agentId: string, title: string): Observable<HaAgent> {
    return this.apiService.put(`${this.route}/title/${agentId}`, {title: title}, HaAgent);
  }

  /**
   * Call http put to update a agent description
   * @param agentId
   * @param description
   * @return the updated agent
   */
  saveAgentDescription(agentId: string, description: Record<string, any>): Observable<HaAgent> {
    return this.apiService.put(`${this.route}/description/${agentId}`, description, HaAgent);
  }

  deleteAgent(id: string): Observable<any> {
    return this.apiService.delete(`${this.route}/${id}`);
  }

  updateAgentStyle(entityId: string, formValue: HaAgentEditStyleFormData): Observable<HaAgent> {
    return this.apiService.put(`${this.route}/style/${entityId}`, formValue, HaAgent);
  }


  //////////////////////////////////// Agent Version //////////////////////////////////////

  /**
   * Call http get to get a agent version by agent id and version number
   * @param agentId
   * @param versionNumber
   * @return the agent version
   */
  getAgentVersionByVersionNumber(agentId: string, versionNumber: string): Observable<HaAgentVersion> {
    return this.apiService.get(`${this.route}/${agentId}/version/${versionNumber}`, HaAgentVersion);
  }

  /**
   * Call http put to update a agent version environment
   * @param agentVersionId
   * @param environment
   * @return the updated agent version
   */
  saveAgentVersionEnvironment(agentVersionId: string, environment: string): Observable<HaAgentVersion> {
    const environmentData = {environment: environment};
    return this.apiService.put(`${this.route}/version/${agentVersionId}/environment`, environmentData, HaAgentVersion);
  }

  /**
   * Call http put to update a agent version params
   * @param agentVersionId
   * @param params
   * @return the updated agent version
   */
  saveAgentVersionParams(agentVersionId: string, params: string[]): Observable<HaAgentVersion> {
    const paramsData = {params: params};
    return this.apiService.put(`${this.route}/version/${agentVersionId}/params`, paramsData, HaAgentVersion);
  }

  /**
   * Call http put to update a agent version code
   * @param agentVersionId
   * @param code
   * @return the updated agent version
   */
  saveAgentVersionCode(agentVersionId: string, code: string): Observable<HaAgentVersion> {
    const codeData = {code: code};
    return this.apiService.put(`${this.route}/version/${agentVersionId}/code`, codeData, HaAgentVersion);
  }

  /**
   * Call http put to publish a agent version
   * @param agentVersionId
   * @return the published agent version
   */
  publishAgentVersion(agentVersionId: string): Observable<HaAgentVersion> {
    return this.apiService.put(`${this.route}/version/${agentVersionId}/publish`, null, HaAgentVersion);
  }

  /**
   * Call http get to get the latest published agent version by agent id
   * @param agentId
   * @return the latest agent version
   */
  getLatestAgentVersionByAgentId(agentId: string): Observable<HaAgentVersion> {
    return this.apiService.get(`${this.route}/${agentId}/version/latest/`, HaAgentVersion);
  }

  /**
   * Call http get to get all published agent versions by agent id
   * @param agentId
   * @return a list of agent versions
   */
  getPublishedAgentVersions(agentId: string): Observable<HaAgentVersion[]> {
    return this.apiService.get(`${this.route}/${agentId}/versions/published`, HaAgentVersion);
  }

  /**
   * Call http put to create a new draft version of a agent
   * @param agentId
   * @param agentVersionFile
   * @return the created agent version
   */
  createNewDraftVersion(agentId: string, agentVersionFile: HaAgentVersionFileInput): Observable<HaAgentVersion> {
    return this.apiService.put(`${this.route}/${agentId}/version/draft`, agentVersionFile, HaAgentVersion);
  }


  /**
   * Call http put to replace a draft version of a agent
   * @param agentId
   * @param agentVersionFile
   * @return the replaced agent version
   */
  replaceDraftVersion(agentId: string, agentVersionFile: HaAgentVersionFileInput): Observable<HaAgentVersion> {
    return this.apiService.put(`${this.route}/${agentId}/version/draft/replace`, agentVersionFile, HaAgentVersion);
  }

  /**
   * Call http put to save a agent version infos
   * @param agentVersionId
   * @param versionInfos
   * @return the updated agent version
   */
  saveAgentVersionInfos(agentVersionId: string, versionInfos: TeRichTextContent): Observable<HaAgentVersion> {
    return this.apiService.put(`${this.route}/version/${agentVersionId}/infos`, versionInfos, HaAgentVersion);
  }

  /**
   * Call http get to get agent version brick dependencies
   * @param agentVersionId
   * return the agent version brickVersions
   */
  getAgentVersionBrickDependencies(agentVersionId: string): Observable<HaBrickVersion[]> {
    return this.apiService.get(`${this.route}/version/${agentVersionId}/brick-dependencies`, HaBrickVersion);
  }

  updateAgentVersionStyle(entityId: string, formValue: HaAgentEditStyleFormData): Observable<HaAgentVersion> {
    return this.apiService.put(`${this.route}/version/style/${entityId}`, formValue, HaAgentVersion);
  }

  ////////////////////////////////////////// CO AUTHORS //////////////////////////////////////////

  acceptInvite(token: string): Observable<HaAgent> {
    return this.apiService.put(`${this.route}/co-authors/invite/${token}/accept`, {}, HaAgent);
  }

  deleteCoAuthorInvite(inviteId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/co-authors/invite/${inviteId}`);
  }

  getCoAuthors(id: string): Observable<HaUser[]> {
    return this.apiService.get(`${this.route}/co-authors/${id}`, HaUser);
  }

  getCoAuthorsPendingInvites(id: string): Observable<HaAgentCoAuthorInvite[]> {
    return this.apiService.get(`${this.route}/co-authors/${id}/pending-invites`, HaAgentCoAuthorInvite, {resultIsPaginated: false});
  }

  inviteCoAuthor(id: string, coAuthorMail: string): Observable<boolean> {
    return this.apiService.post(`${this.route}/co-authors/${id}/invite`, {coAuthorMail: coAuthorMail}, Boolean);
  }

  isCoAuthorInviteValid(token: string): Observable<HaAgentCoAuthorInvite> {
    return this.apiService.get(`${this.route}/co-authors/invite/${token}/is-valid`, HaAgentCoAuthorInvite);
  }

  removeCoAuthor(id: string, coAuthorId: string): Observable<HaAgent> {
    return this.apiService.put(`${this.route}/co-authors/${id}/remove/${coAuthorId}`, {}, HaAgent);
  }

  uploadImage(file: File, agentId: string): Observable<TeUploadedImage>{
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/image/${agentId}`, formData);
  }

  getImageUrl(agentId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${agentId}/image/${name}`);
  }

  uploadFile(file: File, agentId: string): Observable<HaFile>{
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${agentId}`, formData);
  }

  getFilePath(agentId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${agentId}/file/${name}`);
  }


  uploadResourceViewFile(agentId: string, file: FormData): Observable<any>{
    return this.apiService.post(`${this.route}/view/${agentId}`, file);
  }

  getView(agentId: string, id: string): Observable<RvResourceView>{
    return this.apiService.get(`${this.route}/${agentId}/view/${id}`);
  }

  deleteAgentVersion(agentVersionId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/version/${agentVersionId}`);
  }
}
