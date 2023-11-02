import {HaStory} from './ha-story.class';
import {Type} from 'class-transformer';
import {HaUser} from './ha-user';
import {HaInviteStatus} from './ha-invite';



export class HaStoryAuthorInvite{
  id: string;

  email: string;

  status: HaInviteStatus;

  @Type(() => HaStory)
  story: HaStory;

  @Type(() => HaUser)
  createdBy: HaUser;

  token: string;
}
