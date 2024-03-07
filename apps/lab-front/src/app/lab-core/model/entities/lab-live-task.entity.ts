import {TeRichTextContent} from '@monorepo/text-editor';
import {LabEntity} from '../global/lab-entity.entity';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {LabUser} from './lab-user.entity';
import {DateTime} from 'luxon';
import {LtLiveTask} from '@monorepo/live-task';

export class LabLiveTask extends LabEntity {
  title: string;
  space?: any;
  created_at?: string;
  last_modified_at?: string;
  created_by?: LabUser;
  description?: TeRichTextContent;
  latest_publish_version: number;

  toLtLiveTask(): LtLiveTask {
    const ltLiveTask = new LtLiveTask();
    ltLiveTask.id = this.id;
    ltLiveTask.title = this.title;
    ltLiveTask.description = this.description;
    ltLiveTask.latestPublishVersion = this.latest_publish_version;
    ltLiveTask.createdAt = DateTime.fromISO(this.created_at);
    ltLiveTask.lastModifiedAt = DateTime.fromISO(this.last_modified_at);
    ltLiveTask.createdBy = this.created_by;
    ltLiveTask.space = this.space;
    return ltLiveTask;
  }
}

export type LabLiveTaskDatasourcePaginated = FlDatasourcePaginated<LabLiveTask>;

export class LabCreateCommunityLiveTaskVersionResDto {
  id: string;
  live_task_id: string;
}
