import {TeRichTextContent} from '@monorepo/text-editor';
import {LabEntity} from '../global/lab-entity.entity';
import {DateTime} from 'luxon';

export class LabLiveTask extends LabEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion?: number;
  createdBy?: any;
  createdAt: DateTime;
  lastModifiedAt: DateTime;
}
