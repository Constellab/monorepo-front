import {FlDatasourcePaginated} from '../../../model/datasource/fl-datasource-paginated.class';
import {FlUserDto} from './fl-user-dto.class';

export interface FlUser extends FlUserDto {
  email: string;

  biography?: string;

  company?: string;

  activity?: string;

}

export type FlUserDatasource = FlDatasourcePaginated<FlUser>;
