import {TeRichTextContent} from '@monorepo/text-editor';
import {LabEntity} from '../global/lab-entity.entity';
import {DateTime} from 'luxon';

export class LabLiveTask extends LabEntity {
  title: string;
  space?: any;
  created_at?: string;
  last_modified_at?: string;
  created_by?: any;
  description?: TeRichTextContent;
  latest_publish_version: number;
}
