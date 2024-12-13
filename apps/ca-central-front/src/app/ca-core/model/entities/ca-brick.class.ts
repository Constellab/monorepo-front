import { CaEntity } from './ca-entity.entity';
import { Type } from 'class-transformer';
import { LmlBrickVersion } from '@monorepo/lab-manager-lib';


/**
 * A brick is a functionality to configure a Lab.
 * A lab is configured with multiple bricks
 */
export class CaBrick extends CaEntity {
  name: string;

  pipRepo: string;

  gitRepo: string;
}

export class CaBrickVersionComplete extends LmlBrickVersion {
  @Type(() => CaBrick)
  brick: CaBrick;
}
