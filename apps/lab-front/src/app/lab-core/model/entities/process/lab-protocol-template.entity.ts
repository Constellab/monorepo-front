import {FlEntityPaginatedDatasource, FlQuillJson} from '@monorepo/front-core-lib';
import {LabEntityWithTag} from '../lab-entity-with-tag.entity';
import {PrProtocolGraph} from '@monorepo/protocol';


export class LabProtocolTemplate extends LabEntityWithTag {

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
