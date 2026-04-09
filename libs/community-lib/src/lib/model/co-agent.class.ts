import { TdTypeStyle } from '@monorepo/technical-doc';
import { TeRichText } from '@monorepo/text-editor';
import { DateTime } from 'luxon';

import { CoSpace } from './co-space.class';
import { CoUser } from './co-user.class';

export class CoAgent {
  id: string;
  title: string;
  description?: TeRichText;
  space?: CoSpace;
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
