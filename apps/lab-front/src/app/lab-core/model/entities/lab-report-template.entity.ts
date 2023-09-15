import {LabBaseEntityWithUser} from './lab-user.entity';
import {FlDatasourcePaginated, FlQuillJson} from '@monorepo/front-core-lib';


export class LabReportTemplate extends LabBaseEntityWithUser {

  title: string;

  content: FlQuillJson;


  toString(): string {
    return this.title;
  }
}

export type LabReportTemplateDatasource = FlDatasourcePaginated<LabReportTemplate>;

export interface LabReportTemplateForm {
  title: string;
}
