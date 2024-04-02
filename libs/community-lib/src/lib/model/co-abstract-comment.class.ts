import {FlEntity, FlUser} from '@monorepo/front-core-lib';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {TeRichTextContent} from '@monorepo/text-editor';

export enum CoCommentType {
  STORY_COMMENT = 'story',
  LIVE_TASK_COMMENT = 'live-task',
}

export interface CoCommentEntity extends FlEntity{
  comments: number;
}

export abstract class CoAbstractComment<T extends CoCommentEntity> implements FlEntity {
  id: string;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  createdBy: FlUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  lastModifiedBy: FlUser;

  content: TeRichTextContent;

  abstract entity: T;
}
