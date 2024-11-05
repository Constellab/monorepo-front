import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { TeRichTextContent } from '@monorepo/text-editor';
import { Observable } from 'rxjs';
import { HaAbstractComment, HaCommentEntity, HaCommentType } from './ha-abstract-comment.class';

export interface HaCommentServiceInterface {
  getComments(
    commentType: HaCommentType,
    entityId: string
  ): FlDatasourcePaginated<HaAbstractComment<HaCommentEntity>>;

  sendComment(
    commentType: HaCommentType,
    comment: TeRichTextContent,
    entityId: string
  ): Observable<HaAbstractComment<HaCommentEntity>>;
}
