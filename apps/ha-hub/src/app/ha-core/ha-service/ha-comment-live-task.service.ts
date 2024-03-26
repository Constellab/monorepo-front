import {FlApiService, FlDatasourcePaginated, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {CoCommentService} from '@monorepo/community-lib';
import {Observable} from 'rxjs';
import {ClPage} from '@monorepo/core-lib';
import {Injectable} from '@angular/core';
import {TeRichTextContent} from '@monorepo/text-editor';
import {HaCommentLiveTask} from '../ha-model/ha-entities/ha-comment-live-task.class';

@Injectable({
  providedIn: 'root'
})
export class HaCommentLiveTaskService implements CoCommentService {

  private readonly route: string = 'comment-live-task';

  constructor(private apiService: FlApiService) {

  }

  public sendComment(comment: TeRichTextContent, entityId: string): Observable<HaCommentLiveTask> {
    return this.apiService.post(this.route + '/' + entityId, comment, HaCommentLiveTask);
  }

  public getComments(entityId: string): FlDatasourcePaginated<HaCommentLiveTask> {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllComments(page, size, entityId), 5);
  }

  private getAllComments(page: number, size: number, entityId: string): Observable<ClPage<HaCommentLiveTask>> {
    return this.apiService.get(this.route + '/' + entityId, HaCommentLiveTask, {
      page: page,
      pageSize: size,
      resultIsPaginated: true
    });
  }
}
