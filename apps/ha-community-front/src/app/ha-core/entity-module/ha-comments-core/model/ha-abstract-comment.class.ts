import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { FlUser } from '@monorepo/front-core-lib/fl-user';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';
import { DateTime } from 'luxon';

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
