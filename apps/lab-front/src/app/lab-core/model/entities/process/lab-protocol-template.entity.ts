import {FlEntityPaginatedDatasource, FlQuillJson} from '@monorepo/front-core-lib';
import {PrProtocolGraph} from '@monorepo/protocol';
import {LabBaseEntityWithUser} from '../lab-user.entity';


export class LabProtocolTemplate extends LabBaseEntityWithUser {

  name: string;

  description: FlQuillJson;

  data?: PrProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LabProtocolTemplateDatasource = FlEntityPaginatedDatasource<LabProtocolTemplate>;


export interface LabCreateProtocolTemplateDTO {
  name: string;
  description: FlQuillJson;
}
