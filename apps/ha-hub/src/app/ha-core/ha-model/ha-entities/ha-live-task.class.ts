import { HaEntity } from './ha-entity.class';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { HaLiveTaskVersionFileInput } from './ha-live-task-version.class';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CoAgentType, CoCreateAgentFormData } from '@monorepo/community-lib';
import { HaUser } from './ha-user';


export class HaLiveTask extends HaEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
  likes: number;
  comments: number;
  liveTaskCoAuthors: HaLiveTaskCoAuthor[];
}

export class HaCreateLiveTaskDto implements CoCreateAgentFormData{
  title: string;
  type: CoAgentType;
  space?: HaSpace;
  versionFile: HaLiveTaskVersionFileInput;
}

export class HaLiveTaskCoAuthor {
  id: string;
  liveTask: HaLiveTask;
  user: HaUser;
}

// TODO @fvoex mettre F = void et créer des type pour les filtres
export type HaLiveTaskDatasourcePaginated<F = any> = FlDatasourcePaginated<HaLiveTask, F>;
