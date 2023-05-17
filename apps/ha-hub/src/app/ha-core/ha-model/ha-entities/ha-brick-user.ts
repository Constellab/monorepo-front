import {HaUser} from './ha-user';
import {Type} from 'class-transformer';
import {HaBrick} from './ha-brick.class';

export enum HaBrickUserStatus {
  CREATOR = 'CREATOR',
  SIMPLE_USER = 'SIMPLE_USER',
}

export class HaBrickUser{
  id: string;

  @Type(() => HaUser)
  user: HaUser;

  @Type(() => HaBrick)
  brick: HaBrick;

  status: HaBrickUserStatus;
}
