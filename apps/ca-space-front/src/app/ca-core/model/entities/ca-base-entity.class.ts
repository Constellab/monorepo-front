import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { CaEntity } from './ca-entity.entity';
import { CaUser } from './ca-user.class';

export class CaBaseEntity extends CaEntity {
  @ClLuxonDateTimeTransform()
  createdAt: DateTime;

  @Type(() => CaUser)
  createdBy: CaUser;

  @ClLuxonDateTimeTransform()
  lastModifiedAt?: DateTime;

  @Type(() => CaUser)
  lastModifiedBy?: CaUser;
}
