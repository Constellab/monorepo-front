import {FlEntity} from '../../../model/fl-entity.class';
import {FlDatasourcePaginated} from '../../../model/datasource/fl-datasource-paginated.class';

export interface FlUser extends FlEntity{
  firstname: string;

  lastname: string;

  email: string;

  photo?: string;

  fullname: string;

  biography?: string;

  company?: string;

  activity?: string;

}

export type FlUserDatasource = FlDatasourcePaginated<FlUser>;
