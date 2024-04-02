import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {CoAbstractComment, CoCommentEntity, CoCommentType} from './co-abstract-comment.class';
import {TeRichTextContent} from '@monorepo/text-editor';
import {Observable} from 'rxjs';


export interface CoCommentService {
  getComments(commentType: CoCommentType, entityId: string): FlDatasourcePaginated<CoAbstractComment<CoCommentEntity>>;

  sendComment(commentType: CoCommentType, comment: TeRichTextContent, entityId: string): Observable<CoAbstractComment<CoCommentEntity>>;
}
