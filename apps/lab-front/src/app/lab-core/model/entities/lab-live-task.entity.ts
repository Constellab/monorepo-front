import {TeRichTextContent} from '@monorepo/text-editor';
import {LabEntity} from '../global/lab-entity.entity';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {LabUser} from './lab-user.entity';

export class LabLiveTask extends LabEntity {
  title: string;
  space?: any;
  created_at?: string;
  last_modified_at?: string;
  created_by?: LabUser;
  description?: TeRichTextContent;
  latest_publish_version: number;
}

export type LabLiveTaskDatasourcePaginated = FlDatasourcePaginated<LabLiveTask>;

export class LabCreateCommunityLiveTaskVersionResDto {
  id: string;
  live_task_id: string;
}
