import { CaBaseEntity } from './ca-base-entity.class';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { TeRichTextContent } from '@monorepo/text-editor';

export class CaChatMessage extends CaBaseEntity {
  content: TeRichTextContent;
}

export type CaChatMessageDatasourcePaginated = FlDatasourcePaginated<CaChatMessage>;
