import { HaEntity } from './ha-entity.class';
import { CoSpace } from '@monorepo/community-lib';

export class HaSpace extends HaEntity implements CoSpace {
  name: string;
  photo?: string;
  domain: string;
  space: HaSpace;
}
