import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { LiBaseEntityWithUser } from '../li-user.entity';
import { PrProtocolGraph } from '@monorepo/protocol';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export class LiScenarioTemplate extends LiBaseEntityWithUser {
  name: string;

  @TeRichTextTransform()
  description: TeRichText;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LiScenarioTemplateDatasource<F = void> = FlEntityPaginatedDatasource<LiScenarioTemplate, F>;

export class LiCreateScenarioTemplateDTO {
  name: string;

  @TeRichTextTransform()
  description: TeRichText;
}
