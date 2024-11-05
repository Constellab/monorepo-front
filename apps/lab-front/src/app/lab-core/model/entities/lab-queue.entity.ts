import { LabBaseEntity } from '../global/lab-entity.entity';
import { LabUser } from './lab-user.entity';
import { LabScenario } from './lab-scenario.entity';
import { Type } from 'class-transformer';

export class LabQueueJob extends LabBaseEntity {
  @Type(() => LabUser)
  user: LabUser;

  @Type(() => LabScenario)
  scenario: LabScenario;
}
