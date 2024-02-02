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
