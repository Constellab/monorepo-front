import {TeRichTextContent} from '@monorepo/text-editor';
import {DateTime} from 'luxon';
import {CoSpace} from './co-space.class';
import {FlUser} from '@monorepo/front-core-lib';

export class CoLiveTask {
  id: string;
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
  createdBy?: FlUser;
  createdAt?: DateTime;
  lastModifiedAt?: DateTime;
  likes: number;
  comments: number;
}

export enum CoLiveTaskType {
  PUBLIC = 'PUBLIC',
  SPACE = 'SPACE'
}

export class CoCreateLiveTaskFormData {
  title: string;
  type: CoLiveTaskType;
  space?: CoSpace;
}
