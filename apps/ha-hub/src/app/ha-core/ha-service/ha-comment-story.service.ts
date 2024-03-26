import {FlApiService, FlDatasourcePaginated, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {CoCommentService} from '@monorepo/community-lib';
import {Observable} from 'rxjs';
import {ClPage} from '@monorepo/core-lib';
import {Injectable} from '@angular/core';
import {HaCommentStory} from '../ha-model/ha-entities/ha-comment-story.class';
import {TeRichTextContent} from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root'
})
export class HaCommentStoryService implements CoCommentService {

  private readonly route: string = 'comment-story';

  constructor(private apiService: FlApiService) {

  }

  public sendComment(comment: TeRichTextContent, entityId: string): Observable<HaCommentStory> {
    return this.apiService.post(this.route + '/' + entityId, comment, HaCommentStory);
  }

  public getComments(entityId: string): FlDatasourcePaginated<HaCommentStory> {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllComments(page, size, entityId), 5);
  }

  private getAllComments(page: number, size: number, entityId: string): Observable<ClPage<HaCommentStory>> {
    return this.apiService.get(this.route + '/' + entityId, HaCommentStory, {
      page: page,
      pageSize: size,
      resultIsPaginated: true
    });
  }
}
