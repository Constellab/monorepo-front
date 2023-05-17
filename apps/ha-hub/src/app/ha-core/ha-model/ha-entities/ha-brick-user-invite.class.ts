import {HaInviteStatus} from './ha-invite';
import {Type} from 'class-transformer';
import {HaStory} from './ha-story.class';
import {HaUser} from './ha-user';
import {HaBrick} from './ha-brick.class';

export class HaBrickUserInvite{
  id: number;

  email: string;

  status: HaInviteStatus;

  @Type(() => HaStory)
  brick: HaBrick;

  @Type(() => HaUser)
  createdBy: HaUser;

  token: string;
}
