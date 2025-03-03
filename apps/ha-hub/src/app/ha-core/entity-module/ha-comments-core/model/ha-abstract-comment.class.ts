import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { FlUser } from '@monorepo/front-core-lib/fl-user';
import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { DateTime } from 'luxon';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export enum HaCommentType {
  STORY_COMMENT = 'story',
  AGENT_COMMENT = 'agent',
  APP_COMMENT = 'app',
}

export interface HaCommentEntity extends FlEntity {
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

  @TeRichTextTransform()
  content: TeRichText;

  abstract entity: T;
}
