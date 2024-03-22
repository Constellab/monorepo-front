import {FlEntity} from '@monorepo/front-core-lib';
import {DateTime} from 'luxon';
import {ClLuxonDateTimeTransform} from '@monorepo/core-lib';
import {Type} from 'class-transformer';
import {HaUser} from './ha-user';

export abstract class HaAbstractLikeEntity implements FlEntity{
  id: string;

  @ClLuxonDateTimeTransform()
  likedAt: DateTime;

  @Type(() => HaUser)
  likedBy: HaUser;
}
