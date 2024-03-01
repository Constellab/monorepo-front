import {HaEntity} from './ha-entity.class';
import {HaSpace} from './ha-space.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {HaLiveTaskVersionFileInput} from './ha-live-task-version.class';
import {TeRichTextContent} from '@monorepo/text-editor';
import {LtCreateLiveTaskFormData, LtLiveTaskType} from '@monorepo/live-task';

export class HaLiveTask extends HaEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
}

export class HaCreateLiveTaskDto implements LtCreateLiveTaskFormData{
  title: string;
  type: LtLiveTaskType;
  space?: HaSpace;
  versionFile: HaLiveTaskVersionFileInput;
}

export type HaLiveTaskDatasourcePaginated = FlDatasourcePaginated<HaLiveTask>;
