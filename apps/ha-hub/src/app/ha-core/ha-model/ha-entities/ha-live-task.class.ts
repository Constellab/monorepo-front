import {HaEntity} from './ha-entity.class';
import {HaSpace} from './ha-space.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {HaLiveTaskVersionFileInput} from './ha-live-task-version.class';
import {TeRichTextContent} from '@monorepo/text-editor';
import {CoCreateLiveTaskFormData, CoLiveTaskType} from '@monorepo/community-lib';
import {HaUser} from './ha-user';


export class HaLiveTask extends HaEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
  likes: number;
  comments: number;
  liveTaskCoAuthors: HaLiveTaskCoAuthor[];
}

export class HaCreateLiveTaskDto implements CoCreateLiveTaskFormData{
  title: string;
  type: CoLiveTaskType;
  space?: HaSpace;
  versionFile: HaLiveTaskVersionFileInput;
}

export class HaLiveTaskCoAuthor {
  id: string;
  liveTask: HaLiveTask;
  user: HaUser;
}

export type HaLiveTaskDatasourcePaginated = FlDatasourcePaginated<HaLiveTask>;
