import { ClRecordTransform } from '@monorepo/core-lib';
import { PrProtocolIntOut, PrProtocolLink } from '@monorepo/protocol';
import { Expose, Type } from 'class-transformer';

import { LiProcess } from './li-process.entity';

export interface LiProcessLayout {
  x: number;
  y: number;
}

export class LiProtocolLayout {
  /**
   * Record with key = instance_name, value = layout of the process
   */
  @Expose({ name: 'process_layouts' })
  processLayouts: Record<string, LiProcessLayout>;

  @Expose({ name: 'interface_layouts' })
  interfaceLayouts: Record<string, LiProcessLayout>;

  @Expose({ name: 'outerface_layouts' })
  outerfaceLayouts: Record<string, LiProcessLayout>;

  getProcess(instanceName: string): LiProcessLayout | null {
    if (this.processLayouts == null) return null;
    return this.processLayouts[instanceName];
  }

  getInterface(name: string): LiProcessLayout | null {
    if (this.interfaceLayouts == null) return null;
    return this.interfaceLayouts[name];
  }

  getOuterface(name: string): LiProcessLayout | null {
    if (this.outerfaceLayouts == null) return null;
    return this.outerfaceLayouts[name];
  }
}

export class LiProtocolData {
  interfaces: Record<string, PrProtocolIntOut>;

  outerfaces: Record<string, PrProtocolIntOut>;

  @ClRecordTransform(LiProcess)
  nodes: Record<string, LiProcess>;

  links: PrProtocolLink[];

  @Type(() => LiProtocolLayout)
  layout?: LiProtocolLayout;

  public static empty(): LiProtocolData {
    const graph: LiProtocolData = new LiProtocolData();
    graph.interfaces = {};
    graph.outerfaces = {};
    graph.nodes = {};
    graph.links = [];

    return graph;
  }
}

export class LiProtocol extends LiProcess {
  @Type(() => LiProtocolData)
  data: LiProtocolData;

  @Expose({ name: 'is_protocol' })
  isProtocol: true;

  public static empty(): LiProtocol {
    const protocol: LiProtocol = new LiProtocol();
    protocol.inputs = {
      type: 'normal',
      ports: {},
    };
    protocol.outputs = {
      type: 'normal',
      ports: {},
    };
    protocol.data = LiProtocolData.empty();
    return protocol;
  }
}
