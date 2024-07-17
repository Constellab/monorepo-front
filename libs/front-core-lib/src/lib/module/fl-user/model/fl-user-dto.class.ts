import {FlEntity} from '../../../model/fl-entity.class';


export interface FlUserDto extends FlEntity{
  id: string;
  alias: string;
  firstname: string;
  lastname: string;
  photo?: string;
  email?: string;
}
