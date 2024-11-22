import { Injectable } from '@angular/core';
import { FlApiService, FlDatasourceGetPageData, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import {
  HaCreateStoryDto,
  HaListStoryDto,
  HaStory,
  HaStoryDatasourcePaginated,
  HaStoryFilters,
} from '../ha-model/ha-entities/ha-story.class';
import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';
import { HaTopic, HaTopicDto } from '../ha-model/ha-entities/ha-topic.class';
import { HaStoryCoAuthorInvite } from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import { HaFile } from '../entity-module/ha-file-core/model/ha-file';
import {
  TeBlockFigureUploadedResponse,
  TeRichText,
  TeRichTextBlockModificationWithUser,
  TeRichTextDTO,
  TeTextEditorHistoryService,
} from '@monorepo/text-editor';
import { RvResourceView } from '@monorepo/resource-view';
import { HaUser } from '../ha-model/ha-entities/ha-user';
import { HaCoAuthorService } from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import { CoStoryCategory } from '@monorepo/community-lib';
import { HaFileServiceInterface } from '../entity-module/ha-file-core/model/ha-file-service.interface';
import { HaProfileDatasourceFilters } from '../../ha-profile/component/ha-profile/ha-profile.component';

@Injectable({
  providedIn: 'root',
})
export class HaStoryService
  implements HaCoAuthorService, HaFileServiceInterface<HaStory>, TeTextEditorHistoryService
{
  private readonly route: string = 'story';

  constructor(private apiService: FlApiService) {}

  /**
   * Call http post to create a story
   * @param object story to create
   * return a story
   */
  public create(object: HaCreateStoryDto): Observable<HaStory> {
    return this.apiService.post(this.route, object, HaCreateStoryDto);
  }

  /**
   * Call http get to get all stories paginated
   * @param id id of the story
   * return a story
   */
  public getById(id: string): Observable<HaStory> {
    return this.apiService.getById(this.route, id, HaStory);
  }

  /**
   * Call http delete to delete a story
   * @param id id of the story
   * return void
   */
  public delete(id: string): Observable<void> {
    return this.apiService.delete(this.route + '/' + id);
  }

  public getAllPaginatedFiltered(pageSize: number = 10): HaStoryDatasourcePaginated<HaStoryFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, filters) => this.getAllByFilter(filters, page, size),
      pageSize,
      { initFirstPage: false }
    );
  }

  private getAllByFilter(
    data: FlDatasourceGetPageData<HaStoryFilters>,
    page: number,
    size: number
  ): Observable<ClPage<HaListStoryDto>> {
    return this.apiService.post(this.route + '/filter', data.filtersCriteria, HaStory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  private getUserStories(userId: string, page: number, size: number): Observable<ClPage<HaListStoryDto>> {
    return this.apiService.get(this.route + '/user/' + userId, HaListStoryDto, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  public getUserStoriesPaginated(
    pageSize: number = 4
  ): HaStoryDatasourcePaginated<HaProfileDatasourceFilters> {
    return new FlEntityPaginatedDatasource(
      (page, size, filters) => this.getUserStories(filters.filtersCriteria.userId, page, size),
      pageSize,
      { initFirstPage: false }
    );
  }

  /**
   * Call http put to update the title of a story
   * @param storyId id of the story
   * @param title new title
   * return a story
   */
  public updateTitle(storyId: string, title: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/title`, { title: title }, HaStory);
  }

  /**
   * Call http put to update the category of a story
   * @param storyId
   * @param category
   * return a story
   */
  updateCategory(storyId: string, category: CoStoryCategory): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/category`, { category: category }, HaStory);
  }

  /**
   * Call http put to update the content of the story
   * @param id id of the story
   * @param content new content
   * return a story
   */
  public updateContentEdition(id: string, content: TeRichText): Observable<HaStory> {
    return this.apiService.put(this.route + '/' + id + '/content-edition', content.toJson(), HaStory);
  }

  public saveContent(id: string): Observable<HaStory> {
    return this.apiService.put(this.route + '/' + id + '/content', {});
  }

  public updateMainImage(id: string, mainImage: File): Observable<HaStory> {
    const formData = new FormData();
    formData.append('file', mainImage);
    return this.apiService.post(this.route + '/' + id + '/main-image', formData, HaStory);
  }

  public deleteMainImage(id: string): Observable<HaStory> {
    return this.apiService.delete(this.route + '/' + id + '/main-image');
  }

  public getStoryFilePathPrefix(storyId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${storyId}/file/`);
  }

  public getStoryFilePath(storyId: string, storyFileId: string): string {
    return `${this.getStoryFilePathPrefix(storyId)}${storyFileId}`;
  }

  uploadImage(file: File, storyId: string): Observable<TeBlockFigureUploadedResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/image/${storyId}`, formData);
  }

  getImageUrl(storyId: string, name: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/${storyId}/image/${name}`);
  }

  publishStory(id: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${id}/publish`, {});
  }

  getMyStoriesForList(): HaStoryDatasourcePaginated<HaStoryFilters> {
    return new FlEntityPaginatedDatasource<HaListStoryDto, HaStoryFilters>(
      (page, size, filters) => this.getMyStoriesForListPaginated(page, size, filters),
      10,
      { initFirstPage: false }
    );
  }

  private getMyStoriesForListPaginated(
    page: number,
    size: number,
    data: FlDatasourceGetPageData<HaStoryFilters>
  ): Observable<ClPage<HaListStoryDto>> {
    return this.apiService.post(this.route + '/my-filtered', data.filtersCriteria, HaStory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }

  /***
   * Check if the current user is the story owner
   * @param storyId story id
   */
  isStoryOwnerOrCoAuthor(storyId: string): Observable<boolean> {
    return this.apiService.get(`${this.route}/${storyId}/is-owner-or-co-author`, Boolean);
  }

  /***
   * Get story co-authors
   * @param storyId story id
   * @return co-authors users
   */
  getCoAuthors(storyId: string): Observable<HaUser[]> {
    return this.apiService.get(`${this.route}/${storyId}/co-authors`, HaUser);
  }

  /***
   * Add topic to story
   * @param topicDto topic to add
   * @param storyId story id
   */
  addTopicToStory(topicDto: HaTopicDto, storyId: string): Observable<HaTopic> {
    return this.apiService.put(`${this.route}/${storyId}/add-topic`, topicDto, HaTopic);
  }

  /***
   * Remove topic from story
   * @param topicId topic id
   * @param storyId story id
   * @return story
   */
  removeTopicFromStory(topicId: string, storyId: string): Observable<any> {
    return this.apiService.put(`${this.route}/${storyId}/remove-topic/${topicId}`, {});
  }

  /***
   * Remove story co-author
   * @param storyId story id
   * @param storyAuthorId co author id
   * @return story
   */
  removeCoAuthor(storyId: string, storyAuthorId: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/remove-co-author/${storyAuthorId}`, {}, HaStory);
  }

  /***
   * Check if invitation is valid
   */
  isCoAuthorInviteValid(token: string): Observable<HaStoryCoAuthorInvite> {
    return this.apiService.get(`${this.route}/invite/${token}/is-valid`, HaStoryCoAuthorInvite);
  }

  /***
   * Accept invitation
   */
  acceptInvite(token: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/invite/${token}/accept`, {});
  }

  inviteCoAuthor(storyId: string, coAuthorMail: string): Observable<boolean> {
    return this.apiService.post(
      `${this.route}/${storyId}/invite-co-author`,
      { coAuthorMail: coAuthorMail },
      Boolean
    );
  }

  getStoryFiles(storyId: string): Observable<HaFile[]> {
    return this.apiService.get(`${this.route}/story-files/${storyId}`, HaFile, { resultIsPaginated: false });
  }

  uploadFile(file: File, storyId: string): Observable<HaFile> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${storyId}`, formData);
  }

  deleteFile(entityId: string, name: string): Observable<void> {
    return this.apiService.delete(`${this.route}/${entityId}/file/${name}`);
  }

  renameFile(storyFileId: string, newName: string): Observable<HaFile> {
    return this.apiService.put(`${this.route}/file/${storyFileId}/rename`, { humanName: newName }, HaFile);
  }

  getCoAuthorsPendingInvites(storyId: string): Observable<HaStoryCoAuthorInvite[]> {
    return this.apiService.get(`${this.route}/${storyId}/co-authors-pending-invites`, HaStoryCoAuthorInvite, {
      resultIsPaginated: false,
    });
  }

  deleteCoAuthorInvite(inviteId: string): Observable<void> {
    return this.apiService.delete(`${this.route}/invite/${inviteId}`);
  }

  uploadStoryResourceViewFile(storyId: string, file: FormData): Observable<any> {
    return this.apiService.post(`${this.route}/${storyId}/upload-view`, file);
  }

  getView(storyId: string, id: string): Observable<RvResourceView> {
    return this.apiService.get(`${this.route}/${storyId}/view/${id}`);
  }

  getHistory(entityId: string): Observable<TeRichTextBlockModificationWithUser[]> {
    return this.apiService.get(`${this.route}/history/${entityId}/`, TeRichTextBlockModificationWithUser);
  }

  getPreviousVersion(entityId: string, modificationId: string): Observable<TeRichTextDTO> {
    return this.apiService.get(`${this.route}/history/undo-content/${entityId}/${modificationId}`);
  }

  rollbackContent(entityId: string, modificationId: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/history/rollback/${entityId}/${modificationId}`, {});
  }
}
