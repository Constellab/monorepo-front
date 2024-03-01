import {TeRichTextContent} from '@monorepo/text-editor';
import {DateTime} from 'luxon';

export class LtLiveTask {
  id: string;
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
  createdBy?: any;
  createdAt?: DateTime;
  lastModifiedAt?: DateTime;
}

export class LtSpace {
  id: string;
  name: string;
}

export enum LtLiveTaskType {
  PUBLIC = 'PUBLIC',
  SPACE = 'SPACE'
}

export class LtCreateLiveTaskFormData {
  title: string;
  type: LtLiveTaskType;
  space?: LtSpace;
}
