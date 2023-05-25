import {LabProtocolGraph} from './lab-protocol.entity';
import {Type} from 'class-transformer';
import {FlEntityPaginatedDatasource} from '@monorepo/front-core-lib';
import {LabEntityWithTag} from '../lab-entity-with-tag.entity';


export class LabProtocolTemplate extends LabEntityWithTag {

  name: string;

  @Type(() => LabProtocolGraph)
  data?: LabProtocolGraph;

  toString(): string {
    return this.name;
  }
}

export type LabProtocolTemplateDatasource = FlEntityPaginatedDatasource<LabProtocolTemplate>;


export interface LabCreateProtocolTemplateDTO {
  name: string;
}
