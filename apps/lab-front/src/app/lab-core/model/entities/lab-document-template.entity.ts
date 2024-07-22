import { LabBaseEntityWithUser } from './lab-user.entity';
import { FlDatasourcePaginated } from '@monorepo/front-core-lib';
import { TeRichTextContent } from '@monorepo/text-editor';


export class LabDocumentTemplate extends LabBaseEntityWithUser {

  title: string;

  content: TeRichTextContent;


  toString(): string {
    return this.title;
  }
}

export type LabDocumentTemplateDatasource = FlDatasourcePaginated<LabDocumentTemplate>;

export interface LabDocumentTemplateForm {
  title: string;
}
