import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { PrProtocolGraph } from '@monorepo/protocol';
import { TeRichText, teRichTextTransform } from '@monorepo/text-editor';

import { LiBaseEntityWithUser } from '../li-user.entity';

export class LiScenarioTemplate extends LiBaseEntityWithUser {
  name: string;

  @teRichTextTransform()
  description: TeRichText;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LiScenarioTemplateDatasource<F = void> = FlEntityPaginatedDatasource<LiScenarioTemplate, F>;

export class LiCreateScenarioTemplateDTO {
  name: string;

  @teRichTextTransform()
  description: TeRichText;
}
