import {HaInviteStatus} from './ha-invite';
import {Type} from 'class-transformer';
import {HaStory} from './ha-story.class';
import {HaUser} from './ha-user';
import {HaBrick} from './ha-brick.class';
import {HaBaseEntity} from './ha-entity.class';

export class HaBrickUserInvite extends HaBaseEntity{

  email: string;

  status: HaInviteStatus;

  @Type(() => HaStory)
  brick: HaBrick;

  @Type(() => HaUser)
  createdBy: HaUser;

  token: string;
}
