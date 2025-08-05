import { CoSpace } from '@monorepo/community-lib';

import { HaEntity } from './ha-entity.class';

export class HaSpace extends HaEntity implements CoSpace {
  name: string;
  photo?: string;
  domain: string;
  space: HaSpace;
}
