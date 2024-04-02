import {FlApiService, FlDatasourcePaginated, FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {CoAbstractComment, CoCommentEntity, CoCommentService, CoCommentType} from '@monorepo/community-lib';
import {Observable} from 'rxjs';
import {ClPage} from '@monorepo/core-lib';
import {Injectable} from '@angular/core';
import {TeRichTextContent} from '@monorepo/text-editor';

@Injectable({
  providedIn: 'root'
})
export class HaCommentService implements CoCommentService {

  private readonly route: string = 'comment';

  constructor(private apiService: FlApiService) {

  }

  public sendComment(commentType: CoCommentType, comment: TeRichTextContent,
                     entityId: string): Observable<CoAbstractComment<CoCommentEntity>> {
    return this.apiService.post(this.route + '/' + commentType + '/' + entityId, comment, null);
  }

  public getComments(commentType: CoCommentType, entityId: string): FlDatasourcePaginated<CoAbstractComment<CoCommentEntity>> {
    return new FlEntityPaginatedDatasource(
      (page, size) => this.getAllComments(commentType, page, size, entityId), 10);
  }

  private getAllComments(commentType: CoCommentType, page: number,
                         size: number, entityId: string): Observable<ClPage<CoAbstractComment<CoCommentEntity>>> {
    return this.apiService.get(this.route + '/' + commentType + '/' + entityId, null, {
      page: page,
      pageSize: size,
      resultIsPaginated: true
    });
  }
}
