import { DateTime } from 'luxon';
import { CoUser } from './co-user.class';
import { CoSpace } from './co-space.class';

export interface CoCommunityApp {
  id: string;
  createdAt: DateTime;
  createdBy: CoUser;
  lastModifiedAt: DateTime;
  lastModifiedBy: CoUser;
  title: string;
  appUrl: string;
  shortDescription?: string;
  likes: number;
  comments: number;
  executions: number;
  space?: CoSpace;
}
