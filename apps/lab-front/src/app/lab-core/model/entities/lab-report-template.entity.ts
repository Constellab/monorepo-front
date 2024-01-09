import {LabBaseEntityWithUser} from './lab-user.entity';
import {FlDatasourcePaginated} from '@monorepo/front-core-lib';
import {TeRichTextContent} from '@monorepo/text-editor';


export class LabReportTemplate extends LabBaseEntityWithUser {

  title: string;

  content: TeRichTextContent;


  toString(): string {
    return this.title;
  }
}

export type LabReportTemplateDatasource = FlDatasourcePaginated<LabReportTemplate>;

export interface LabReportTemplateForm {
  title: string;
}
