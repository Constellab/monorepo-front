import { Expose } from 'class-transformer';
import { LiProcess } from './li-process.entity';

export class LiTask extends LiProcess {
  @Expose({ name: 'is_protocol' })
  isProtocol: false;
}
