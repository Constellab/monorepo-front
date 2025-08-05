import { CoAgentType, CoCreateAgentFormData } from '@monorepo/community-lib';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TdTypeStyle } from '@monorepo/technical-doc';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

import { HaAgentVersionFileInput } from './ha-agent-version.class';
import { HaEntity } from './ha-entity.class';
import { HaSpace } from './ha-space.class';
import { HaUser } from './ha-user';

export class HaAgent extends HaEntity {
  title: string;

  @TeRichTextTransform()
  description?: TeRichText;
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
