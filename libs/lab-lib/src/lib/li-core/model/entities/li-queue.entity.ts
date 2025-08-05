import { Type } from 'class-transformer';

import { LiBaseEntity } from '../global/li-entity.entity';
import { LiScenario } from './li-scenario.entity';
import { LiUser } from './li-user.entity';

export class LiQueueJob extends LiBaseEntity {
  @Type(() => LiUser)
  user: LiUser;

  @Type(() => LiScenario)
  scenario: LiScenario;
}
