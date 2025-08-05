import { inject, Injectable } from '@angular/core';
import { ClPage } from '@monorepo/core-lib';
import { FlApiService } from '@monorepo/front-core-lib/fl-api';
import { FlDatasourcePaginated, FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { TeRichText } from '@monorepo/text-editor';
import { Observable } from 'rxjs';

import {
  HaAbstractComment,
  HaCommentEntity,
} from '../entity-module/ha-comments-core/model/ha-abstract-comment.class';
import { HaEntityType } from '../ha-model/ha-entities/ha-entity-type';

@Injectable({
  providedIn: 'root',
})
export class HaCommentService {
  private apiService = inject(FlApiService);

  private readonly route: string = 'comment';

  public sendComment(
    commentType: HaEntityType,
    comment: TeRichText,
    entityId: string
  ): Observable<HaAbstractComment<HaCommentEntity>> {
    return this.apiService.post(this.route + '/' + commentType + '/' + entityId, comment.toJson(), null);
  }

  public getComments(
    commentType: HaEntityType,
    entityId: string
  ): FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>> {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllComments(commentType, page, size, entityId),
      10
    );
  }

  private getAllComments(
    commentType: HaEntityType,
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
