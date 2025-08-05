import { Type } from 'class-transformer';

import { CaBaseEntity } from '../ca-base-entity.class';
import { CaBrickVersionComplete } from '../ca-brick.class';

export class CaLabConfig extends CaBaseEntity {
  label: string;

  @Type(() => CaBrickVersionComplete)
  brickVersions: CaBrickVersionComplete[];
}
