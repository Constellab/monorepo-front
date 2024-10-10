import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { PrProtocolGraph } from '@monorepo/protocol';
import { LabBaseEntityWithUser } from '../lab-user.entity';
import { TeRichTextContent } from '@monorepo/text-editor';


export class LabScenarioTemplate extends LabBaseEntityWithUser {

  name: string;

  description: TeRichTextContent;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LabScenarioTemplateDatasource<F = void> = FlEntityPaginatedDatasource<LabScenarioTemplate, F>;


export interface LabCreateScenarioTemplateDTO {
  name: string;
  description: TeRichTextContent;
}
