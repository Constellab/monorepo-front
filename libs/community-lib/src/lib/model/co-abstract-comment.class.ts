import {FlEntity, FlUser} from '@monorepo/front-core-lib';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {DateTime} from 'luxon';
import {TeRichTextContent} from '@monorepo/text-editor';

export abstract class CoAbstractComment implements FlEntity{
  id: string;

  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  createdBy: FlUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt: DateTime;

  lastModifiedBy: FlUser;

  content: TeRichTextContent;
}
