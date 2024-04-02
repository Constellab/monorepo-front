import {FlEntity} from '@monorepo/front-core-lib';
import {DateTime} from 'luxon';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {Type} from 'class-transformer';
import {HaUser} from './ha-user';
import {HaBaseEntity} from './ha-entity.class';

export abstract class HaAbstractLikeEntity<T extends HaBaseEntity> implements FlEntity{
  id: string;

  @ClLuxonDateTimeTransform()
  likedAt: DateTime;

  @Type(() => HaUser)
  likedBy: HaUser;

  abstract entity: T;
}
