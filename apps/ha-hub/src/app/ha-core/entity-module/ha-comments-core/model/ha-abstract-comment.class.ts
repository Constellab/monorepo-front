import {FlEntity, FlUser} from '@monorepo/front-core-lib';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {TeRichTextContent} from '@monorepo/text-editor';

export enum HaCommentType {
  STORY_COMMENT = 'story',
  AGENT_COMMENT = 'agent',
}

export interface HaCommentEntity extends FlEntity{
  comments: number;
}

export abstract class HaAbstractComment<T extends HaCommentEntity> implements FlEntity {
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
