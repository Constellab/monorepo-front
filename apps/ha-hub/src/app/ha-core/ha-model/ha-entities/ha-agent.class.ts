import { HaEntity } from './ha-entity.class';
import { HaSpace } from './ha-space.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { HaAgentVersionFileInput } from './ha-agent-version.class';
import { TeRichTextContent } from '@monorepo/text-editor';
import { CoAgentType, CoCreateAgentFormData } from '@monorepo/community-lib';
import { HaUser } from './ha-user';


export class HaAgent extends HaEntity {
  title: string;
  description?: TeRichTextContent;
  space?: any;
  latestPublishVersion: number;
  likes: number;
  comments: number;
  agentCoAuthors: HaAgentCoAuthor[];
}

export class HaCreateAgentDto implements CoCreateAgentFormData{
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

// TODO @fvoex mettre F = void et créer des type pour les filtres
export type HaAgentDatasourcePaginated<F = any> = FlDatasourcePaginated<HaAgent, F>;
