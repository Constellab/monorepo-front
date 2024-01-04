import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {PrProtocolGraph} from '@monorepo/protocol';
import {LabBaseEntityWithUser} from '../lab-user.entity';
import {TeTextEditorContent} from '@monorepo/text-editor';


export class LabProtocolTemplate extends LabBaseEntityWithUser {

  name: string;

  description: TeTextEditorContent;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LabProtocolTemplateDatasource = FlEntityPaginatedDatasource<LabProtocolTemplate>;


export interface LabCreateProtocolTemplateDTO {
  name: string;
  description: TeTextEditorContent;
}
