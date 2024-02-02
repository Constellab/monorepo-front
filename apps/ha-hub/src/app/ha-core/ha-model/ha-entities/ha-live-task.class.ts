import {HaEntity} from './ha-entity.class';
import {HaSpace} from './ha-space.class';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {HaListStoryDto} from './ha-story.class';
import {HaLiveTaskVersionFileInput} from './ha-live-task-version.class';
import {TeRichTextContent} from '@monorepo/text-editor';
import {DateTime} from 'luxon';

export enum HaLiveTaskType {
  PUBLIC = 'PUBLIC',
  SPACE = 'SPACE'
}

export class HaLiveTask extends HaEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
}

export class HaCreateLiveTaskDto {
  title: string;
  type: HaLiveTaskType;
  space?: HaSpace;
  versionFile: HaLiveTaskVersionFileInput;
}

export type HaLiveTaskDatasourcePaginated = FlDatasourcePaginated<HaLiveTask>;
