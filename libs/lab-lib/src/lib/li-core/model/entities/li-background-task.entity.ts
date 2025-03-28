import { LiEntity } from '../global/li-entity.entity';
import { LiProgressMessage } from './li-progress-bar.entity';
import { Type } from 'class-transformer';

export class LiBackgroundTask extends LiEntity {
  title: string;

  @Type(() => LiProgressMessage)
  messages: LiProgressMessage[];

  progress?: number;
}
