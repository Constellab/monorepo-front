import { Type } from 'class-transformer';

import { LiEntity } from '../global/li-entity.entity';
import { LiProgressMessage } from './li-progress-bar.entity';

export class LiBackgroundTask extends LiEntity {
  title: string;

  @Type(() => LiProgressMessage)
  messages: LiProgressMessage[];

  progress?: number;
}
