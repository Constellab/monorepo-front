import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

import { CaBaseEntity } from './ca-base-entity.class';

export class CaChatMessage extends CaBaseEntity {
  @TeRichTextTransform()
  content: TeRichText;
}

export type CaChatMessageDatasourcePaginated = FlDatasourcePaginated<CaChatMessage>;
