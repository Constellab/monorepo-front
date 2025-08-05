import { ClLuxonDateTimeTransform } from '@monorepo/core-lib';
import { FlEntity } from '@monorepo/front-core-lib/fl-core';
import { Type } from 'class-transformer';
import { DateTime } from 'luxon';

import { HaBaseEntity } from './ha-entity.class';
import { HaUser } from './ha-user';

export abstract class HaAbstractLikeEntity<T extends HaBaseEntity> implements FlEntity {
  id: string;

  @ClLuxonDateTimeTransform()
  likedAt: DateTime;

  @Type(() => HaUser)
  likedBy: HaUser;

  abstract entity: T;
}
