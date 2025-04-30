import { HaUser } from './ha-user';
import { Type } from 'class-transformer';
import { HaBrick } from './ha-brick.class';
import { HaBaseEntity } from './ha-entity.class';

export class HaBrickUser extends HaBaseEntity {
  @Type(() => HaUser)
  user: HaUser;

  @Type(() => HaBrick)
  brick: HaBrick;
}
