import { TeRichText } from '@monorepo/text-editor';
import { DateTime } from 'luxon';

import { CoSpace } from './co-space.class';
import { CoUser } from './co-user.class';

export interface CoCommunityApp {
  id: string;
  createdAt: DateTime;
  createdBy: CoUser;
  lastModifiedAt: DateTime;
  lastModifiedBy: CoUser;
  title: string;
  appUrl: string;
  description?: TeRichText;
  likes: number;
  comments: number;
  executions: number;
  space?: CoSpace;
}
