import { FlApiService, FlDatasourcePaginated, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { Observable } from 'rxjs';
import { ClPage } from '@monorepo/core-lib';
import { Injectable } from '@angular/core';
import { TeRichText } from '@monorepo/text-editor';
import {
  HaAbstractComment,
  HaCommentEntity,
  HaCommentType,
} from '../entity-module/ha-comments-core/model/ha-abstract-comment.class';

@Injectable({
  providedIn: 'root',
})
export class HaCommentService {
  private readonly route: string = 'comment';

  constructor(private apiService: FlApiService) {}

  public sendComment(
    commentType: HaCommentType,
    comment: TeRichText,
    entityId: string
  ): Observable<HaAbstractComment<HaCommentEntity>> {
    return this.apiService.post(this.route + '/' + commentType + '/' + entityId, comment.toJson(), null);
  }

  public getComments(
    commentType: HaCommentType,
    entityId: string
  ): FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>> {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllComments(commentType, page, size, entityId),
      10
    );
  }

  private getAllComments(
    commentType: HaCommentType,
    page: number,
    size: number,
    entityId: string
  ): Observable<ClPage<HaAbstractComment<HaCommentEntity>>> {
    return this.apiService.get(this.route + '/' + commentType + '/' + entityId, null, {
      page: page,
      pageSize: size,
      resultIsPaginated: true,
    });
  }
}
