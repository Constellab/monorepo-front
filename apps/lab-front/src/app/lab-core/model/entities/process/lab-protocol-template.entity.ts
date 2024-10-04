import { FlEntityPaginatedDatasource } from '@monorepo/front-core-lib';
import { PrProtocolGraph } from '@monorepo/protocol';
import { LabBaseEntityWithUser } from '../lab-user.entity';
import { TeRichTextContent } from '@monorepo/text-editor';


export class LabProtocolTemplate extends LabBaseEntityWithUser {

  name: string;

  description: TeRichTextContent;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LabProtocolTemplateDatasource<F = void> = FlEntityPaginatedDatasource<LabProtocolTemplate, F>;


export interface LabCreateProtocolTemplateDTO {
  name: string;
  description: TeRichTextContent;
}
