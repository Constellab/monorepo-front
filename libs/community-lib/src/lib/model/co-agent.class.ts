import { TdTypeStyle } from '@monorepo/technical-doc';
import { DateTime } from 'luxon';

import { CoSpace } from './co-space.class';
import { CoUser } from './co-user.class';
import { TeRichText } from '@monorepo/text-editor';

export class CoAgent {
  id: string;
  title: string;
  // TODO to improve when lib imports are better managed
  // type rich text, but to avoid loading text-editor module, we use any
  description?: TeRichText;
  space?: any;
  latestPublishVersion: number;
  createdBy?: CoUser;
  createdAt?: DateTime;
  lastModifiedAt?: DateTime;
  likes: number;
  comments: number;
  latestStyle?: TdTypeStyle;
}

export enum CoAgentType {
  PUBLIC = 'PUBLIC',
  SPACE = 'SPACE',
}

export class CoCreateAgentFormData {
  title: string;
  type: CoAgentType;
  space?: CoSpace;
}
