import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {CoAbstractComment} from './co-abstract-comment.class';
import {TeRichTextContent} from '@monorepo/text-editor';
import {Observable} from 'rxjs';

export interface CoCommentService {
  getComments(entityId: string): FlDatasourcePaginated<CoAbstractComment>;

  sendComment(comment: TeRichTextContent, entityId: string): Observable<CoAbstractComment>;
}
