import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {
  HaCreateStoryDto,
  HaListStoryDto,
  HaMyStoriesDataSource,
  HaStory,
  HaStoryCategory,
  HaStoryDataSourceDataDto,
  HaStoryDatasourcePaginated,
  HaStoryFilter
} from '../ha-model/ha-entities/ha-story.class';
import {Observable} from 'rxjs';
import {ClPage, ClRichTextI} from '@monorepo/core-lib';
import {HaTopic, HaTopicDto} from '../ha-model/ha-entities/ha-topic.class';
import {HaStoryAuthorInvite} from '../ha-model/ha-entities/ha-story-author-invite.class';
import {HaStoryFile} from '../ha-model/ha-entities/ha-story-file';
import {TeRichTextContent, TeUploadedImage} from '@monorepo/text-editor';


@Injectable({
  providedIn: 'root'
})
export class HaStoryService {
  private readonly route: string = 'story';

  constructor(private apiService: FlApiService) {

  }

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
   * Call http get to get all stories paginated
   * @param page page number
   * @param size page size
   * return a list of stories paginated
   */
  private getAll(page: number, size: number): Observable<ClPage<HaListStoryDto>> {
    return this.apiService.get(this.route, HaStory, {page: page, pageSize: size, resultIsPaginated: true});
  }

  public getAllPaginated(): HaStoryDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAll(page, size), 10);
  }


  public getAllPaginatedFiltered(filters: HaStoryFilter): HaStoryDatasourcePaginated {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllByFilter(filters, page, size), 10);
  }

  private getAllByFilter(filters: HaStoryFilter, page: number, size: number): Observable<ClPage<HaListStoryDto>> {
    return this.apiService.post(this.route + '/filter', filters, HaStory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true
    });
  }

  /**
   * Call http put to update the title of a story
   * @param storyId id of the story
   * @param title new title
   * return a story
   */
  public updateTitle(storyId: string, title: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/title`, {title: title}, HaStory);
  }

  /**
   * Call http put to update the category of a story
   * @param storyId
   * @param category
   * return a story
   */
  updateCategory(storyId: string, category: HaStoryCategory): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/category`, {category: category}, HaStory);
  }

  /**
   * Call http put to update the content of the story
   * @param id id of the story
   * @param content new content
   * return a story
   */
  public updateContent(id: string, content: TeRichTextContent): Observable<HaStory> {
    return this.apiService.put(this.route + '/' + id + '/content', {content: content}, HaStory);
  }

  public getImagePath(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  public getStoryFilePath(storyFileId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/get-file/${storyFileId}`);
  }

  uploadImage(file: File, storyId: string): Observable<TeUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/image/${storyId}`, formData);
  }

  getImageUrl(filename: string): string {
    return this.getImagePath(filename);
  }

  publishStory(id: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${id}/publish`, {});
  }

  getMyStories(): HaMyStoriesDataSource {
    return new FlEntityPaginatedDatasource((page, size) =>
      this.getMyStoriesPaginated(page, size), 10);
  }

  private getMyStoriesPaginated(page: number, size: number): Observable<ClPage<HaStoryDataSourceDataDto>> {
    return this.apiService.get(this.route + '/my', HaStory, {page: page, pageSize: size, resultIsPaginated: true});
  }


  /***
   * Check if the current user is the story owner
   * @param storyId story id
   */
  isStoryOwnerOrCoAuthor(storyId: string): Observable<boolean> {
    return this.apiService.get(`${this.route}/${storyId}/is-owner-or-co-author`, Boolean);
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
  removeStoryCoAuthor(storyId: string, storyAuthorId: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/remove-co-author/${storyAuthorId}`, {}, HaStory);
  }

  /***
   * Check if invitation is valid
   */
  isInvitationValid(token: string): Observable<HaStoryAuthorInvite> {
    return this.apiService.get(`${this.route}/invite/${token}/is-valid`, HaStoryAuthorInvite);
  }

  /***
   * Accept invitation
   */
  acceptInvite(token: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/invite/${token}/accept`, {});
  }

  inviteStoryCoAuthor(storyId: string, coAuthorMail: string): Observable<boolean>{
    return this.apiService.post(`${this.route}/${storyId}/invite-co-author`, {coAuthorMail: coAuthorMail}, Boolean);
  }


  uploadDocument(file: File, storyId: string): Observable<HaStoryFile>{
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${storyId}`, formData);
  }

  deleteStoryFile(storyFileId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/file/${storyFileId}`);
  }

  renameStoryFile(storyFileId: string, newName: string): Observable<HaStoryFile>{
    return this.apiService.put(`${this.route}/file/${storyFileId}/rename`, {humanName: newName}, HaStoryFile);
  }

  getStoryCoAuthorsPendingInvites(storyId: string): Observable<HaStoryAuthorInvite[]>{
    return this.apiService.get(`${this.route}/${storyId}/co-authors-pending-invites`, HaStoryAuthorInvite, {resultIsPaginated: false});
  }

  deleteCoAuthorInvite(inviteId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/invite/${inviteId}`);
  }
}
