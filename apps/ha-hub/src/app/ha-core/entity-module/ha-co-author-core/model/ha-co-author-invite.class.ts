import {HaStory} from '../../../ha-model/ha-entities/ha-story.class';
import {Type} from 'class-transformer';
import {HaUser} from '../../../ha-model/ha-entities/ha-user';
import {HaInviteStatus} from '../../../ha-model/ha-entities/ha-invite';
import {HaBaseEntity} from '../../../ha-model/ha-entities/ha-entity.class';
import {HaBrick} from '../../../ha-model/ha-entities/ha-brick.class';
import {HaLiveTask} from '../../../ha-model/ha-entities/ha-live-task.class';


export class HaCoAuthorInvite extends HaBaseEntity{

    email: string;

    status: HaInviteStatus;

    @Type(() => HaUser)
    createdBy: HaUser;

    token: string;

}


export class HaStoryCoAuthorInvite extends HaCoAuthorInvite{

  @Type(() => HaStory)
  story: HaStory;
}


export class HaBrickCoAuthorInvite extends HaCoAuthorInvite{

  @Type(() => HaBrick)
  brick: HaBrick;
}

export class HaLiveTaskCoAuthorInvite extends HaCoAuthorInvite{

  @Type(() => HaLiveTask)
  liveTask: HaLiveTask;
}
