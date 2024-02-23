import {ClRecordTransform} from '@monorepo/core-lib';
import {Expose, Type} from 'class-transformer';
import {LabProcess} from './lab-process.entity';
import {PrProtocolIntOut, PrProtocolLink} from '@monorepo/protocol';

export interface LabProcessLayout {
  x: number;
  y: number;
}

export class LabProtocolLayout {
  /**
   * Record with key = instance_name, value = layout of the process
   */
  @Expose({name: 'process_layouts'})
  processLayouts: Record<string, LabProcessLayout>;

  @Expose({name: 'interface_layouts'})
  interfaceLayouts: Record<string, LabProcessLayout>;

  @Expose({name: 'outerface_layouts'})
  outerfaceLayouts: Record<string, LabProcessLayout>;

  getProcess(instanceName: string): LabProcessLayout | null {
    if (this.processLayouts == null) return null;
    return this.processLayouts[instanceName];
  }

  getInterface(name: string): LabProcessLayout | null {
    if (this.interfaceLayouts == null) return null;
    return this.interfaceLayouts[name];
  }

  getOuterface(name: string): LabProcessLayout | null {
    if (this.outerfaceLayouts == null) return null;
    return this.outerfaceLayouts[name];
  }
}


export class LabProtocolData {

  interfaces: Record<string, PrProtocolIntOut>;

  outerfaces: Record<string, PrProtocolIntOut>;

  @ClRecordTransform(LabProcess)
  nodes: Record<string, LabProcess>;

  links: PrProtocolLink[];

  @Type(() => LabProtocolLayout)
  layout?: LabProtocolLayout;

  public static empty(): LabProtocolData {
    const graph: LabProtocolData = new LabProtocolData();
    graph.interfaces = {};
    graph.outerfaces = {};
    graph.nodes = {};
    graph.links = [];

    return graph;
  }
}


export class LabProtocol extends LabProcess {

  @Type(() => LabProtocolData)
  data: LabProtocolData;

  @Expose({name: 'is_protocol'})
  isProtocol: true;

  public static empty(): LabProtocol {
    const protocol: LabProtocol = new LabProtocol();
    protocol.inputs = {
      type: 'normal',
      ports: {},
    };
    protocol.outputs = {
      type: 'normal',
      ports: {},
    };
    protocol.data = LabProtocolData.empty();
    return protocol;
  }


  getNodes(): Record<string, LabProcess> {
    return this.data.nodes;
  }

  public getProcess(instanceName: string): LabProcess {
    return this.getNodes()[instanceName];
  }
}

