import {FlDatasourcePaginated} from '../../../model/datasource/fl-datasource-paginated.class';
import {FlEntity} from '../../../model/fl-entity.class';

export interface FlUser extends FlEntity {
  alias: string;

  firstname: string;

  lastname: string;

  photo?: string;

  email?: string;

  company?: string;

  activity?: string;

}

export type FlUserDatasource = FlDatasourcePaginated<FlUser>;
