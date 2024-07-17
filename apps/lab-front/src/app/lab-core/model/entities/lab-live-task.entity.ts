import { TeRichTextContent } from '@monorepo/text-editor';
import { LabEntity } from '../global/lab-entity.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { DateTime } from 'luxon';
import { CoLiveTask, CoUser } from '@monorepo/community-lib';

export class LabLiveTask extends LabEntity {
  title: string;
  space?: any;
  created_at?: string;
  last_modified_at?: string;
  created_by?: CoUser;
  description?: TeRichTextContent;
  latest_publish_version: number;

  toCoLiveTask(): CoLiveTask {
    const coLiveTask = new CoLiveTask();
    coLiveTask.id = this.id;
    coLiveTask.title = this.title;
    coLiveTask.description = this.description;
    coLiveTask.latestPublishVersion = this.latest_publish_version;
    coLiveTask.createdAt = DateTime.fromISO(this.created_at);
    coLiveTask.lastModifiedAt = DateTime.fromISO(this.last_modified_at);
    coLiveTask.createdBy = this.created_by;
    coLiveTask.space = this.space;
    return coLiveTask;
  }
}

export type LabLiveTaskDatasourcePaginated = FlDatasourcePaginated<LabLiveTask>;

export class LabCreateCommunityLiveTaskVersionResDto {
  id: string;
  live_task_id: string;
}
