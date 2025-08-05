import { Type } from 'class-transformer';

import { CaEntity } from './ca-entity.entity';

/**
 * A brick is a functionality to configure a Lab.
 * A lab is configured with multiple bricks
 */
export class CaBrick extends CaEntity {
  name: string;

  pipRepo: string;

  gitRepo: string;
}

export class CaBrickVersionComplete {
  @Type(() => CaBrick)
  brick: CaBrick;

  version: string;
}
