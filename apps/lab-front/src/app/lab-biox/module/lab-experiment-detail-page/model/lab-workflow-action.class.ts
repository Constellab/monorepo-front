import {LabProcess} from '../../../../lab-core/model/entities/process/lab-process.entity';
import {LabProtocolLink} from '../../../../lab-core/model/entities/lab-protocol-link.entity';
import {LabProcessTransform} from '../../../../lab-core/model/entities/process/lab-process.transform';
import {Expose, Type} from 'class-transformer';
import {LabProtocol} from '../../../../lab-core/model/entities/process/lab-protocol.entity';


export class LabProtocolUpdateDTO{

  @LabProcessTransform()
  process?: LabProcess;

  @Type(() => LabProtocolLink)
  link: LabProtocolLink;

  @Type(() => LabProtocol)
  protocol?: LabProtocol;

  @Expose({name: 'protocol_updated'})
  protocolUpdated: boolean;
}
