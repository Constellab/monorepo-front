import { HaEntity } from './ha-entity.class';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { HaAgentVersionFileInput } from './ha-agent-version.class';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CoAgentType, CoCreateAgentFormData } from '@monorepo/community-lib';
import { HaUser } from './ha-user';
import { TdTypeStyle } from '@monorepo/technical-doc';

export class HaAgent extends HaEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
  likes: number;
  comments: number;
  agentCoAuthors: HaAgentCoAuthor[];
  latestStyle?: TdTypeStyle;
}

export class HaCreateAgentDto implements CoCreateAgentFormData {
  title: string;
  type: CoAgentType;
  space?: HaSpace;
  versionFile: HaAgentVersionFileInput;
}

export class HaAgentCoAuthor {
  id: string;
  agent: HaAgent;
  user: HaUser;
}

export interface HaAgentDatasourceFilters {
  titleFilter: string;
  spacesFilter: string[];
}

export type HaAgentDatasourcePaginated<F = void> = FlDatasourcePaginated<HaAgent, F>;
