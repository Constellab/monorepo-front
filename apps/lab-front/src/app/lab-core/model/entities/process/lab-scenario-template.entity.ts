import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib/fl-core';
import { PrProtocolGraph } from '@monorepo/protocol';
import { LabBaseEntityWithUser } from '../lab-user.entity';
import { TeRichText, TeRichTextTransform } from '@monorepo/text-editor';

export class LabScenarioTemplate extends LabBaseEntityWithUser {
  name: string;

  @TeRichTextTransform()
  description: TeRichText;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LabScenarioTemplateDatasource<F = void> = FlEntityPaginatedDatasource<LabScenarioTemplate, F>;

export class LabCreateScenarioTemplateDTO {
  name: string;

  @TeRichTextTransform()
  description: TeRichText;
}
