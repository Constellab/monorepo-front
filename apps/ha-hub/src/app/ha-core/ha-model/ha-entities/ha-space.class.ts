import {HaEntity} from './ha-entity.class';


export class HaSpace extends HaEntity {
  name: string;
  photo: string;
  domain: string;
  space: HaSpace;
}
