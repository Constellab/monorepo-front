import { PrProtocolIntOut, PrProtocolLink } from '@monorepo/protocol';
import { Expose, Type } from 'class-transformer';

import { LiProcess } from './li-process.entity';
import { liProcessTransform } from './li-process.transform';
import { LiProtocol } from './li-protocol.entity';

export class LiProtocolUpdateDTO {
  @liProcessTransform()
  process?: LiProcess;

  link: PrProtocolLink;

  ioface?: PrProtocolIntOut;

  @Type(() => LiProtocol)
  protocol?: LiProtocol;

  @Expose({ name: 'protocol_updated' })
  protocolUpdated: boolean;

  @Expose({ name: 'sub_protocols' })
  @Type(() => LiProtocol)
  subProtocols: LiProtocol[];
}
