import {Expose} from 'class-transformer';
import {LabProcess} from './lab-process.entity';


export class LabTask extends LabProcess {

  @Expose({name: 'is_protocol'})
  isProtocol: false;
}
