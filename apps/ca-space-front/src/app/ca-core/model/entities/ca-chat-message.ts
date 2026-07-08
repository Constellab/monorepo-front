import { FlDatasourcePaginated } from '@monorepo/front-core-lib/fl-core';
import { TeRichText, teRichTextTransform } from '@monorepo/text-editor';

import { CaBaseEntity } from './ca-base-entity.class';

export class CaChatMessage extends CaBaseEntity {
  @teRichTextTransform()
  content: TeRichText;
}

export type CaChatMessageDatasourcePaginated = FlDatasourcePaginated<CaChatMessage>;
