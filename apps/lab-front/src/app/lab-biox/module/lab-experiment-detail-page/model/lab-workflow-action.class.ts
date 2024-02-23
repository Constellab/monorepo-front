import {LabProcess} from '../../../../lab-core/model/entities/process/lab-process.entity';
import {LabProcessTransform} from '../../../../lab-core/model/entities/process/lab-process.transform';
import {Expose, Type} from 'class-transformer';
import {LabProtocol} from '../../../../lab-core/model/entities/process/lab-protocol.entity';
import {PrProtocolLink} from '@monorepo/protocol';


export class LabProtocolUpdateDTO {

  @LabProcessTransform()
  process?: LabProcess;

  link: PrProtocolLink;

  @Type(() => LabProtocol)
  protocol?: LabProtocol;

  @Expose({name: 'protocol_updated'})
  protocolUpdated: boolean;

  @Expose({name: 'sub_protocols'})
  @Type(() => LabProtocol)
  subProtocols: LabProtocol[];
}
