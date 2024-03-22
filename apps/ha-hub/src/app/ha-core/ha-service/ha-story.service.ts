import {Injectable} from '@angular/core';
import {FlApiService, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {
  HaCreateStoryDto,
  HaListStoryDto,
  HaStory,
  HaStoryDatasourcePaginated,
  HaStoryFilter
} from '../ha-model/ha-entities/ha-story.class';
import {Observable} from 'rxjs';
import {ClPage} from '@monorepo/core-lib';
import {HaTopic, HaTopicDto} from '../ha-model/ha-entities/ha-topic.class';
import {HaStoryCoAuthorInvite} from '../entity-module/ha-co-author-core/model/ha-co-author-invite.class';
import {HaFile} from '../ha-model/ha-entities/ha-file';
import {TeRichTextContent, TeUploadedImage} from '@monorepo/text-editor';
import {RvResourceView} from '@monorepo/resource-view';
import {HaUser} from '../ha-model/ha-entities/ha-user';
import {HaCoAuthorService} from '../entity-module/ha-co-author-core/model/ha-co-author-service';
import {CoStoryCategory} from '@monorepo/community-lib';


@Injectable({
  providedIn: 'root'
})
export class HaStoryService implements HaCoAuthorService{
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
   * Call http delete to delete a story
   * @param id id of the story
   * return void
   */
  public delete(id: string): Observable<void> {
    return this.apiService.delete(this.route + '/' + id);
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
  updateCategory(storyId: string, category: CoStoryCategory): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${storyId}/category`, {category: category}, HaStory);
  }

  /**
   * Call http put to update the content of the story
   * @param id id of the story
   * @param content new content
   * return a story
   */
  public updateContent(id: string, content: TeRichTextContent): Observable<HaStory> {
    return this.apiService.put(this.route + '/' + id + '/content-edition', {contentEdition: content}, HaStory);
  }

  public saveContent(id: string): Observable<HaStory>{
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

  public getStoryFilePath(storyFileId: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/get-file/${storyFileId}`);
  }

  uploadImage(file: File, storyId: string): Observable<TeUploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.put(`${this.route}/image/${storyId}`, formData);
  }

  getImageUrl(filename: string): string {
    return this.apiService.getBaseRouteUrl(`${this.route}/image/${filename}`);
  }

  publishStory(id: string): Observable<HaStory> {
    return this.apiService.put(`${this.route}/${id}/publish`, {});
  }

  getMyStoriesForList(filters: HaStoryFilter): HaStoryDatasourcePaginated {
    return new FlEntityPaginatedDatasource((page, size) =>
      this.getMyStoriesForListPaginated(filters, page, size), 10);
  }

  private getMyStoriesForListPaginated(filters: HaStoryFilter, page: number, size: number): Observable<ClPage<HaListStoryDto>> {
    return this.apiService.post(this.route + '/my-filtered', filters, HaStory, {page: page, pageSize: size, resultIsPaginated: true});
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

  inviteCoAuthor(storyId: string, coAuthorMail: string): Observable<boolean>{
    return this.apiService.post(`${this.route}/${storyId}/invite-co-author`, {coAuthorMail: coAuthorMail}, Boolean);
  }


  uploadDocument(file: File, storyId: string): Observable<HaFile>{
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.post(`${this.route}/file/${storyId}`, formData);
  }

  deleteStoryFile(storyFileId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/file/${storyFileId}`);
  }

  renameStoryFile(storyFileId: string, newName: string): Observable<HaFile>{
    return this.apiService.put(`${this.route}/file/${storyFileId}/rename`, {humanName: newName}, HaFile);
  }

  getCoAuthorsPendingInvites(storyId: string): Observable<HaStoryCoAuthorInvite[]>{
    return this.apiService.get(`${this.route}/${storyId}/co-authors-pending-invites`, HaStoryCoAuthorInvite, {resultIsPaginated: false});
  }

  deleteCoAuthorInvite(inviteId: string): Observable<void>{
    return this.apiService.delete(`${this.route}/invite/${inviteId}`);
  }

  uploadStoryResourceViewFile(storyId: string, file: FormData): Observable<any>{
    return this.apiService.post(`${this.route}/${storyId}/upload-view`, file);
  }

  getView(filename: string): Observable<RvResourceView>{
    return this.apiService.get(`${this.route}/view/${filename}`);
  }
}
